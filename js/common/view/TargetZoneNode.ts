// Copyright 2025, University of Colorado Boulder

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import membraneChannels from '../../membraneChannels.js';
import MembraneChannelsModel, { Slot } from '../model/MembraneChannelsModel.js';

/**
 * A target zone where a membrane channel can be dropped.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class TargetZoneNode extends Rectangle {
  public constructor( public readonly slot: Slot, model: MembraneChannelsModel, modelViewTransform: ModelViewTransform2 ) {

    // TODO: Model bounds? We decided proteins will have the same model width footprint, but that should be factored out.
    super( 0, 0, 60, 80, 15, 10, {
      center: modelViewTransform.modelToViewXY( model.getSlotPosition( slot ), 0 ),
      stroke: 'blue',
      lineWidth: 2,
      lineDash: [ 4, 4 ],

      // Only shown when the user is dragging a membrane toward it
      visible: false
    } );
  }
}

membraneChannels.register( 'TargetZoneNode', TargetZoneNode );