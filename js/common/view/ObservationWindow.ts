// Copyright 2025, University of Colorado Boulder

import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MembraneChannelsConstants, { LIGAND_COUNT } from '../../common/MembraneChannelsConstants.js';
import membraneChannels from '../../membraneChannels.js';
import membraneChannelsStrings from '../../MembraneChannelsStrings.js';
import { getFeatureSetHasLigands } from '../MembraneChannelsFeatureSet.js';
import MembraneChannelsModel from '../model/MembraneChannelsModel.js';
import LigandNode from './LigandNode.js';
import MembraneProteinInteractionNode from './MembraneProteinInteractionNode.js';
import ObservationWindowCanvasNode from './ObservationWindowCanvasNode.js';
import ObservationWindowChannelLayer from './ObservationWindowChannelLayer.js';
import LigandANode from './particles/LigandANode.js';
import LigandBNode from './particles/LigandBNode.js';
import TargetZoneNode from './TargetZoneNode.js';

/**
 * Shows the rectangle with the cross section of the cell membrane where solutes, ligands, membrane channels are.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

export default class ObservationWindow extends Node {

  private readonly ligandNodes: LigandNode[] = [];
  public readonly targetZoneNodes: TargetZoneNode[];
  public readonly membraneProteinInteractionNodes: MembraneProteinInteractionNode[];

  private readonly stepEmitter = new Emitter<[ number ]>( {
    parameters: [ { valueType: 'number' } ]
  } );

  public constructor( model: MembraneChannelsModel, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2, tandem: Tandem ) {

    const frameNode = new Rectangle( 0, 0, MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT, {
      stroke: 'black',
      lineWidth: 2
    } );

    // Clipping region that contains the background canvas and the ligand node
    // TODO: The canvas node doesn't actually need to be clipped since it can only draw within its bounds. UPDATE: Removing the clip shows a lot of drawing out of the bounds.
    const clipNode = new Node( {
      clipArea: Shape.rectangle( 0, 0, MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT )
    } );

    super( {
      children: [ clipNode, frameNode ]
    } );

    // first, we will have a background canvas layer for the performance intensive parts
    const backCanvas = new ObservationWindowCanvasNode( model, modelViewTransform, canvasBounds, 'back' );
    clipNode.addChild( backCanvas );
    this.stepEmitter.addListener( dt => backCanvas.step( dt ) );

    const channelLayer = new ObservationWindowChannelLayer( model, modelViewTransform );
    this.stepEmitter.addListener( dt => channelLayer.step( dt ) );
    clipNode.addChild( channelLayer );

    // ligand and membrane channel layer
    // On top, we will have a layer for the interactive parts of the simulation

    if ( getFeatureSetHasLigands( model.featureSet ) ) {
      const groupTandem = tandem.createGroupTandem( 'ligandNodes' );

      const ligandViewNodes = [ new LigandANode(), new LigandBNode() ];
      ligandViewNodes.forEach( ( ligandViewNode, j ) => {
        for ( let i = 0; i < LIGAND_COUNT; i++ ) {
          const ligandNode = new LigandNode( model.areLigandsAddedProperty, model.ligands, i + j * LIGAND_COUNT, modelViewTransform, ligandViewNode, groupTandem.createNextTandem(), i === 0 );
          this.ligandNodes.push( ligandNode );
        }
      } );

      // Put in random z-order
      const shuffledLigandNodes = dotRandom.shuffle( this.ligandNodes );
      shuffledLigandNodes.forEach( ligandNode => clipNode.addChild( ligandNode ) );
    }

    // NOTE: Duplication with SoluteBarChartsAccordionBox
    const TEXT_MARGIN = 3;
    const textOptions = { fontSize: 13, right: MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH - TEXT_MARGIN, maxWidth: 200 };
    const outsideText = new Text( membraneChannelsStrings.outsideStringProperty, combineOptions<TextOptions>( { top: TEXT_MARGIN }, textOptions ) );
    const insideText = new Text( membraneChannelsStrings.insideStringProperty, combineOptions<TextOptions>( { bottom: MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT - TEXT_MARGIN }, textOptions ) );

    this.addChild( outsideText );
    this.addChild( insideText );

    this.membraneProteinInteractionNodes = Array.from( model.getTargetKeys() ).map( targetKey => new MembraneProteinInteractionNode( model, targetKey, modelViewTransform ) );
    this.membraneProteinInteractionNodes.forEach( membraneProteinInteractionNode => this.addChild( membraneProteinInteractionNode ) );

    this.targetZoneNodes = Array.from( model.getTargetKeys() ).map( targetKey => new TargetZoneNode( targetKey, modelViewTransform ) );
    this.targetZoneNodes.forEach( targetZoneNode => this.addChild( targetZoneNode ) );

    // Draw the particles in front
    const frontCanvas = new ObservationWindowCanvasNode( model, modelViewTransform, canvasBounds, 'front' );
    clipNode.addChild( frontCanvas );
    this.stepEmitter.addListener( dt => frontCanvas.step( dt ) );
  }

  public step( dt: number ): void {
    this.stepEmitter.emit( dt );

    this.ligandNodes.forEach( ligandNode => ligandNode.step() );
  }

}
membraneChannels.register( 'ObservationWindow', ObservationWindow );