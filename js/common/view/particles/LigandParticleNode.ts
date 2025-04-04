// Copyright 2025, University of Colorado Boulder

import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import potassiumLigand_svg from '../../../../images/potassiumLigand_svg.js';
import sodiumLigand_svg from '../../../../images/sodiumLigand_svg.js';
import membraneTransport from '../../../membraneTransport.js';
import MembraneTransportConstants from '../../MembraneTransportConstants.js';

/**
 * LigandParticleNode shows the potassium and sodium ligands.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class LigandParticleNode extends Node {

  public constructor( type: 'ligandA' | 'ligandB' ) {

    super( {
      children: [ new Image( type === 'ligandA' ? sodiumLigand_svg : potassiumLigand_svg, {
        scale: MembraneTransportConstants.TRANSPORT_PROTEIN_IMAGE_SCALE
      } ) ]
    } );
  }
}

membraneTransport.register( 'LigandParticleNode', LigandParticleNode );