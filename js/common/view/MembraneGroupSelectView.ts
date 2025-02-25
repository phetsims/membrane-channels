// Copyright 2025, University of Colorado Boulder

import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import GroupSelectModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSelectModel.js';
import GroupSelectView from '../../../../scenery-phet/js/accessibility/group-sort/view/GroupSelectView.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import membraneChannels from '../../membraneChannels.js';
import MembraneChannelsConstants, { MODEL_HEIGHT } from '../MembraneChannelsConstants.js';
import MembraneChannelsModel, { ChannelType, Slot, SLOT_COUNT } from '../model/MembraneChannelsModel.js';
import ChannelDragNode from './ChannelDragNode.js';
import MembraneChannelsScreenView from './MembraneChannelsScreenView.js';
import ObservationWindow from './ObservationWindow.js';

// This is the index of the slot in the model, or if an item has been grabbed.
type SortItem = number | 'grabbedItem';

type Selection = {
  grabbedNode: ChannelDragNode;
  initialSlot: Slot;
  currentIndex: number;
};

const MODEL_DRAG_VERTICAL_OFFSET = 10;

/**
 * Keyboard interaction for channels on the membrane.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class MembraneGroupSelectView extends GroupSelectView<SortItem, Node> {

  private currentSelection: Selection | null = null;

  public constructor( private readonly membraneChannelsModel: MembraneChannelsModel, private readonly view: MembraneChannelsScreenView, private readonly observationWindow: ObservationWindow ) {

    // TODO: Delete this! We don't need it any more.
    const returnToToolboxRectangle = new Rectangle( 0, 0, 50, 50, {
      fill: 'blue',
      centerX: observationWindow.bounds.width - 30,
      centerY: observationWindow.bounds.height / 4 - 23,
      opacity: 0
    } );
    observationWindow.addChild( returnToToolboxRectangle );

    const groupSelectModel = new GroupSelectModel<SortItem>( {
      getGroupItemValue: slotIndex => 0, // TODO
      tandem: Tandem.OPT_OUT // TODO?
    } );

    // A list of all keys that are listened to, except those covered by the numberKeyMapper
    // TODO: Copied from GroupSortInteraction
    const sortingKeys = [
      'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', // default-step sort
      'shift+d', 'shift+arrowRight', 'shift+a', 'shift+arrowLeft', 'shift+arrowUp', 'shift+arrowDown', 'shift+w', 'shift+s', // shift-step sort
      'pageUp', 'pageDown', // page-step sort
      'home', 'end' // min/max
    ] as const;


    const sortStep = 1;

    // TODO: Copied from GroupSortInteraction
    /**
     * Get the delta to change the value given what key was pressed. The returned delta may not result in a value in range,
     * please constrain value from range or provide your own defensive measures to this delta.
     */
    const getDeltaForKey = ( key: string ): number | null => {
      const fullRange = 7;
      return key === 'home' ? -fullRange :
             key === 'end' ? fullRange :
               // key === 'pageDown' ? -this.pageSortStep :
               // key === 'pageUp' ? this.pageSortStep :
             [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( key ) ? -sortStep :
             [ 'arrowRight', 'd', 'arrowUp', 'w' ].includes( key ) ? sortStep :
               // [ 'shift+arrowLeft', 'shift+a', 'shift+arrowDown', 'shift+s' ].includes( key ) ? -this.shiftSortStep :
               // [ 'shift+arrowRight', 'shift+d', 'shift+arrowUp', 'shift+w' ].includes( key ) ? this.shiftSortStep :
             null;
    };

    // // TODO: Mostly Copied from GroupSortInteraction
    const deltaKeyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: sortingKeys,
      fire: ( event, keysPressed ) => {

        if ( groupSelectModel.selectedGroupItemProperty.value !== null ) {

          const groupItem = groupSelectModel.selectedGroupItemProperty.value;
          const oldValue = this.model.getGroupItemValue( groupItem )!;
          // assert && assert( oldValue !== null, 'We should have a group item when responding to input?' );

          // Sorting an item
          if ( groupSelectModel.isGroupItemKeyboardGrabbedProperty.value ) {

            // Don't do any sorting when disabled
            // For these keys, the item will move by a particular delta
            if ( this.model.enabled && sortingKeys.includes( keysPressed ) ) {
              const delta = getDeltaForKey( keysPressed )!;
              assert && assert( delta !== null, 'should be a supported key' );

              const grabbedNode = this.currentSelection!.grabbedNode;
              const currentIndex = this.currentSelection!.currentIndex;

              const newIndex = clamp( currentIndex + delta, 0, SLOT_COUNT );

              if ( newIndex === SLOT_COUNT ) {
                grabbedNode.setModelPosition( new Vector2( 90, 50 ) ); // TODO: Coordinate bounds with the returnToToolboxRectangle
              }
              else {
                const newSlot = membraneChannelsModel.getSlotForIndex( newIndex );
                const newPosition = membraneChannelsModel.getSlotPosition( newSlot );
                grabbedNode.setModelPosition( new Vector2( newPosition, MODEL_DRAG_VERTICAL_OFFSET ) );
              }

              this.currentSelection!.currentIndex = newIndex;
            }
          }
          else {

            // Selecting an item
            const unclampedDelta = getDeltaForKey( keysPressed );
            if ( unclampedDelta !== null ) {
              this.model.hasKeyboardSelectedGroupItemProperty.value = true;

              const channelNodes = observationWindow.getChannelNodes();

              const selectMax = channelNodes.length - 1;
              const clampedDelta = clamp( oldValue + unclampedDelta, 0, selectMax );

              groupSelectModel.selectedGroupItemProperty.value = clampedDelta;
            }
          }
          this.onGroupItemChange( groupItem );
        }
      }
    } );

    observationWindow.addInputListener( deltaKeyboardListener );

    super( groupSelectModel, observationWindow, {

      // Called when a selected item becomes "grabbed" for sorting
      onGrab: ( groupItem: SortItem ) => {

        if ( groupItem === 'grabbedItem' ) {
          console.log( 'hello grabbed item' );
        }
        else {
          const slot = observationWindow.getChannelNodes()[ groupItem ].slot;

          const channelType = membraneChannelsModel.getSlotContents( slot );
          affirm( channelType, 'The grabbed item should have a channel type' );

          // Remove the channel from the model
          membraneChannelsModel.setSlotContents( slot, null );

          this.initialDragWork( slot, channelType );

          groupSelectModel.selectedGroupItemProperty.value = 'grabbedItem';
        }
      },
      onRelease: ( groupItem: SortItem ) => {

        if ( groupItem === 'grabbedItem' ) {

          const currentIndex = this.currentSelection!.currentIndex;
          const grabbedNode = this.currentSelection!.grabbedNode;

          // Triggered automatically on backspace/delete, so be graceful
          if ( currentIndex >= 0 && grabbedNode && !grabbedNode.isDisposed ) {

            // when returning focus here
            const droppedIntoSlot = membraneChannelsModel.getSlotForIndex( currentIndex );
            if ( currentIndex < SLOT_COUNT ) {
              membraneChannelsModel.setSlotContents( droppedIntoSlot, grabbedNode.type );
            }

            // TODO: When dropping an item with spacebar, focus correctly goes back to the toolbox.
            // TODO: However, when dropping an item with enter, focus incorrectly stays on the group and creates another channel on the left.
            view.keyboardDroppedMembraneChannel();

            // Look through the nodes to find the corresponding index of the one just released, so it can retain highlight.
            let selectedIndex = null;
            observationWindow.getChannelNodes().forEach( ( node, index ) => {
              if ( node.slot === droppedIntoSlot ) {
                selectedIndex = index;
              }
            } );

            // Dropped into membrane
            if ( currentIndex < SLOT_COUNT ) {
              groupSelectModel.selectedGroupItemProperty.value = selectedIndex;
            }
            else {

              // dropped into toolbox
              groupSelectModel.selectedGroupItemProperty.value = observationWindow.getChannelNodes().length === 0 ? null : 0;
            }

            this.currentSelection.grabbedNode.dispose();
            this.currentSelection = null;
          }
        }
        else {
          console.log( 'was not dragged item, but why' );
        }
      },
      getGroupItemToSelect: () => {

        const channelNodes = observationWindow.getChannelNodes();
        if ( channelNodes.length > 0 ) {
          return 0; // the left most Node
        }
        else {
          return null;
        }
      },
      getNodeFromModelItem: model => {

        if ( model === 'grabbedItem' ) {
          return this.currentSelection!.grabbedNode;
        }
        else {
          const channelNodes = observationWindow.getChannelNodes();
          return channelNodes[ model ].node;
        }
      },
      grabReleaseCueOptions: {
        center: observationWindow.bounds.center.plusXY( 0, observationWindow.modelViewTransform.modelToViewDeltaY( MODEL_HEIGHT * 0.25 ) )
      }
    } );

    // Specify shape around the membrane
    const verticalFractionalHeight = 0.3;
    const horizontalMargin = 5;
    this.groupSortGroupFocusHighlightPath.shape = Shape.rect(
      -horizontalMargin, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT / 2 - MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT * verticalFractionalHeight / 2,
      horizontalMargin * 2 + MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT * verticalFractionalHeight );

    // Resets fields tracking what is grabbed, where it was grabbed from, etc that are saved at the beginning
    // of an interaction.
    const resetState = () => {
      this.currentSelection?.grabbedNode.dispose();
      this.currentSelection = null;
    };

    // add a keyboard listener to delete the currently grabbed item
    const keyboardListener = new KeyboardListener( {
      keys: [ 'backspace', 'delete', 'escape' ],
      fire: ( event, keysPressed ) => {

        if ( groupSelectModel.isGroupItemKeyboardGrabbedProperty.value ) {
          if ( keysPressed === 'backspace' || keysPressed === 'delete' ) {

            resetState();

            groupSelectModel.isGroupItemKeyboardGrabbedProperty.value = false;

            // next, tell the group sort interaction that nothing is grabbed.
            const leftmostFilledSlot = membraneChannelsModel.getLeftmostFilledSlot();
            if ( leftmostFilledSlot ) {
              groupSelectModel.selectedGroupItemProperty.value = membraneChannelsModel.getSlotIndex( leftmostFilledSlot );
            }
            else {
              groupSelectModel.selectedGroupItemProperty.value = null;
            }

            // TODO: If you grabbed from the toolbox, then hit backspace/delete, focus should go back to the toolbox.
            // See how this is done via keyboardDroppedMembraneChannel when something is dropped in the membrane
          }
          else {
            // TODO: Why is this not running? The GroupSelectView.grabReleaseKeyboardListener seems to be firing and taking over the escape key. https://github.com/phetsims/scenery/issues/1692
            // TODO: JG will investigate simplifying the overlap + override parameters in KeyboardListener to make this possible.

            const initialSlot = this.currentSelection!.initialSlot;
            const grabbedNode = this.currentSelection!.grabbedNode;

            affirm( initialSlot, 'initialSlot should be set' );
            affirm( grabbedNode, 'grabbedNode should be set' );
            membraneChannelsModel.setSlotContents( initialSlot, grabbedNode.type );

            const tempInitialSlot = initialSlot;
            resetState();

            // TODO: these come back in if we have to turn off the supertype escape listener. https://github.com/phetsims/scenery/issues/1692
            // isGroupItemKeyboardGrabbedProperty.value = false;
            // isKeyboardFocusedProperty.value = true;

            groupSelectModel.selectedGroupItemProperty.value = membraneChannelsModel.getSlotIndex( tempInitialSlot );
          }
        }
      }
    } );
    observationWindow.addInputListener( keyboardListener );
  }

  private initialDragWork( slot: Slot, channelType: ChannelType ): void {

    // Create a ChannelDragNode at the location of the selected item, in an offset position.
    this.currentSelection = {
      grabbedNode: this.view.createFromKeyboard( channelType ),
      initialSlot: slot,
      currentIndex: this.membraneChannelsModel.getSlotIndex( slot )
    };

    // Offset above the membrane so it is clear it isn't in the model
    this.currentSelection.grabbedNode.setModelPosition( new Vector2( this.membraneChannelsModel.getSlotPosition( slot ), MODEL_DRAG_VERTICAL_OFFSET ) );
  }

  public forwardFromKeyboard( slot: Slot, channelType: ChannelType ): void {
    this.observationWindow.focus();

    // TODO: There must be a better way to do this internally, https://github.com/phetsims/membrane-channels/issues/20
    this.observationWindow.membraneGroupSelectView.model.hasKeyboardGrabbedGroupItemProperty.value = true;
    this.observationWindow.membraneGroupSelectView.model.isKeyboardFocusedProperty.value = true;

    this.initialDragWork( slot, channelType );

    this.observationWindow.membraneGroupSelectView.model.selectedGroupItemProperty.value = 'grabbedItem';
    this.observationWindow.membraneGroupSelectView.model.isGroupItemKeyboardGrabbedProperty.value = true;
  }
}

membraneChannels.register( 'MembraneGroupSelectView', MembraneGroupSelectView );