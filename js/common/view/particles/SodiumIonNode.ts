// Copyright 2025, University of Colorado Boulder

import Vector2 from '../../../../../dot/js/Vector2.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Color from '../../../../../scenery/js/util/Color.js';
import MembraneChannelsColors from '../../../common/MembraneChannelsColors.js';
import membraneChannels from '../../../membraneChannels.js';

/**
 * Sodium ion node. Does not rotate.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class SodiumIonNode extends Node {

  public constructor() {

    const radius = 16;
    const options: ShadedSphereNodeOptions = {
      mainColor: MembraneChannelsColors.sodiumIonColorProperty,
      highlightColor: new Color( 255, 255, 255 ),
      lineWidth: 1,
      stroke: 'black'
    };
    const sodium = new ShadedSphereNode( radius, options );
    const lineWidth = 11;
    const plusNode = new Node( {
      children: [
        new Line( 0, 0, 0, lineWidth, { stroke: 'black', lineWidth: 2 } ),
        new Line( -lineWidth / 2, lineWidth / 2, lineWidth / 2, lineWidth / 2, { stroke: 'black', lineWidth: 2 } )
      ],
      center: new Vector2( 0, 0 )
    } );

    super( { children: [ sodium, plusNode ] } );
  }
}

membraneChannels.register( 'SodiumIonNode', SodiumIonNode );