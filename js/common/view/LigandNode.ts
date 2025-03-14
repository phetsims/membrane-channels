// Copyright 2025, University of Colorado Boulder

/**
 * LigandNode is a node that represents a ligand in the simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import membraneChannels from '../../membraneChannels.js';
import MembraneChannelsConstants from '../MembraneChannelsConstants.js';
import Particle from '../model/Particle.js';
import { LigandType } from '../model/SoluteType.js';

export default class LigandNode extends Node {
  public constructor(
    areLigandsAddedProperty: TProperty<boolean>,
    private readonly ligands: Particle<LigandType>[],
    private readonly ligandIndex: number,
    private readonly modelViewTransform: ModelViewTransform2,
    ligandView: Node,
    tandem: Tandem,
    focusable: boolean
  ) {

    const options = combineOptions<NodeOptions>( {
      children: [ ligandView ],
      visibleProperty: areLigandsAddedProperty,
      cursor: 'pointer',
      accessibleName: 'Ligand', // TODO (design): What should this be?
      focusable: focusable
    }, AccessibleDraggableOptions, {

      // Must take precedence over the AccessibleDraggableOptions which has focusable: true
      focusable: focusable
    } );

    super( options );

    // For dragging relative to the press point on the ligand
    let pressOffset: null | Vector2 = null;

    const soundRichDragListener = new SoundRichDragListener( {
      start: event => {
        this.operateOnLigand( ligand => {
          ligand.mode = { type: 'userControlled', slot: null };

          // Store initial offset from pointer to ligand position
          const localPoint = this.globalToParentPoint( event.pointer.point );
          const modelPoint = this.modelViewTransform.viewToModelPosition( localPoint );
          pressOffset = modelPoint.minus( ligand.position );
        } );
      },
      drag: ( event, listener ) => {

        this.operateOnLigand( ligand => {

          const constrainPosition = ( proposedPosition: Vector2 ) => {
            const boundModelPoint = MembraneChannelsConstants.OUTSIDE_CELL_BOUNDS.closestPointTo( proposedPosition );
            ligand.position.set( boundModelPoint );
          };

          if ( event.isFromPDOM() ) {
            const proposedPosition = ligand.position.plus( listener.modelDelta );
            constrainPosition( proposedPosition );
          }
          else {
            const localPoint = this.globalToParentPoint( event.pointer.point );
            const modelPointerPosition = this.modelViewTransform.viewToModelPosition( localPoint );
            const proposedPosition = modelPointerPosition.minus( pressOffset! );
            constrainPosition( proposedPosition );
          }
        } );
      },
      end: () => {
        this.operateOnLigand( ligand => {
          ligand.mode = soundRichDragListener.dragListener.looksOverProperty.value ? { type: 'userOver', slot: null } : ligand.createRandomWalkMode();
        } );
        pressOffset = null;
      },
      transform: this.modelViewTransform,
      dragListenerOptions: {
        tandem: tandem.createTandem( 'soundRichDragListener' )
      },
      keyboardDragListenerOptions: {
        tandem: tandem.createTandem( 'keyboardDragListener' ),
        dragSpeed: 200,
        shiftDragSpeed: 50
      }
    } );
    this.addInputListener( soundRichDragListener );

    // TODO (JG): Rename looksOverProperty? Or maybe we need a new Property for isOverProperty || focusedProperty
    soundRichDragListener.dragListener.looksOverProperty.link( isOver => {
      this.operateOnLigand( ligand => {

        // If the ligand is already controlled, don't start walking when the pointer goes out
        if ( ligand.mode.type !== 'userControlled' ) {
          ligand.mode = isOver ? { type: 'userOver', slot: null } : ligand.createRandomWalkMode();
        }
      } );
    } );
  }

  /**
   * Do some work on the Ligand associate with this Node if it exists. Otherwise, do nothing. The ligand in the model
   * may be added or removed but the view component will always exist.
   */
  private operateOnLigand( operation: ( ligand: Particle<LigandType> ) => void ): void {
    const ligand = this.ligands[ this.ligandIndex ] || null;
    if ( ligand ) {
      operation( ligand );
    }
  }

  /**
   * Update the view with the animation state since the positions are not observable.
   */
  public step(): void {
    this.operateOnLigand( ligand => {
      this.center = this.modelViewTransform.modelToViewPosition( ligand.position );
    } );
  }
}
membraneChannels.register( 'LigandNode', LigandNode );
