// Copyright 2025, University of Colorado Boulder

import Emitter from '../../../../axon/js/Emitter.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { AlignGroup, Circle, DragListener, HSeparator, Node, PressListenerEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MembraneChannelsConstants from '../../common/MembraneChannelsConstants.js';
import membraneChannels from '../../membraneChannels.js';
import membraneChannelsStrings from '../../MembraneChannelsStrings.js';

/**
 * Shows the title and group of accordion boxes for the membrane channels, which can be dragged into the play area.
 *
 * TODO: Better name to indicate this is for a control panel and not named MembraneChannels because of the sim name?
 *
 * TODO:
 * - maxWidth
 * - dynamic layout
 * - PhET-iO
 * - keyboard
 * - description
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class MembraneChannelsAccordionBoxGroup extends Node {
  public readonly resetEmitter = new Emitter();

  public constructor( tandem: Tandem, createCircle: ( event: PressListenerEvent ) => void ) {

    const fontSize = 18;
    const accordionBoxOptions: AccordionBoxOptions = {
      useExpandedBoundsWhenCollapsed: false,
      cornerRadius: 0,
      lineWidth: 0,
      titleAlignX: 'left',
      fill: 'white'
    };

    const circleIcon = new Circle( 15, { fill: 'rgba( 255,0,0,0.5)' } );

    circleIcon.addInputListener( DragListener.createForwardingListener( event => {
      createCircle( event );
    } ) );

    const contentAlignGroup = new AlignGroup();

    const accordionBoxes = [
      new AccordionBox( contentAlignGroup.createBox( circleIcon ), combineOptions<AccordionBoxOptions>( {
        expandedDefaultValue: true,
        titleNode: new Text( 'Leakage', { fontSize: fontSize } ),
        tandem: tandem.createTandem( 'leakageAccordionBox' )
      }, accordionBoxOptions ) ),
      new AccordionBox( contentAlignGroup.createBox( new Text( 'placeholder-text placeholder-text' ) ), combineOptions<AccordionBoxOptions>( {
        expandedDefaultValue: false,
        titleNode: new Text( 'Voltage', { fontSize: fontSize } ),
        tandem: tandem.createTandem( 'voltageAccordionBox' )
      }, accordionBoxOptions ) ),
      new AccordionBox( contentAlignGroup.createBox( new Text( 'placeholder-text placeholder-text' ) ), combineOptions<AccordionBoxOptions>( {
        expandedDefaultValue: false,
        titleNode: new Text( 'Ligand', { fontSize: fontSize } ),
        tandem: tandem.createTandem( 'ligandAccordionBox' )
      }, accordionBoxOptions ) ),
      new AccordionBox( contentAlignGroup.createBox( new Text( 'placeholder-text placeholder-text' ) ), combineOptions<AccordionBoxOptions>( {
        expandedDefaultValue: false,
        titleNode: new Text( 'Active', { fontSize: fontSize } ),
        tandem: tandem.createTandem( 'activeAccordionBox' )
      }, accordionBoxOptions ) )
    ];
    accordionBoxes.forEach( box => {
      box.expandedProperty.link( expanded => {
        if ( expanded ) {

          // collapse the other ones
          accordionBoxes.forEach( otherBox => {
            if ( otherBox !== box ) {
              otherBox.expandedProperty.value = false;
            }
          } );
        }
      } );
    } );
    const interleaveHSeparators = ( nodes: Node[] ) => {
      const result: Node[] = [];
      for ( let i = 0; i < nodes.length; i++ ) {
        if ( i > 0 ) {
          result.push( new HSeparator( { stroke: 'black', lineWidth: 1 } ) );
        }
        result.push( nodes[ i ] );
      }
      return result;
    };
    const vbox = new VBox( {
      spacing: 0,
      children: [
        new Text( membraneChannelsStrings.membraneChannelsStringProperty, {
          fontSize: MembraneChannelsConstants.PANEL_TITLE_FONT_SIZE
        } ),

        ...interleaveHSeparators( accordionBoxes )
      ]
    } );
    super( {
      children: [ vbox ]
    } );

    this.resetEmitter.addListener( () => accordionBoxes.forEach( box => box.reset() ) );

    this.mutate( { left: 20, top: 20 } );
  }

  public reset(): void {
    this.resetEmitter.emit();
  }
}

membraneChannels.register( 'MembraneChannelsAccordionBoxGroup', MembraneChannelsAccordionBoxGroup );