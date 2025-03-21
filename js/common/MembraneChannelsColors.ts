// Copyright 2024-2025, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Sam Reid (PhET Interactive Simulations
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import membraneChannels from '../membraneChannels.js';

const MembraneChannelsColors = {

  // Color for the outside/extracellular fluid, also serves as the background color for the screen.
  outsideCellColorProperty: new ProfileColorProperty( membraneChannels, 'outsideCellColor', {
    default: 'rgb(152,205,255)'
  } ),
  insideCellColorProperty: new ProfileColorProperty( membraneChannels, 'insideCellColor', {
    default: 'rgb(101,185,234)'
  } ),
  oxygenColorProperty: new ProfileColorProperty( membraneChannels, 'O2Color', {
    default: PhetColorScheme.RED_COLORBLIND.toCSS() // Same as ph-scale OxygenNode
  } ),
  phosphateColorProperty: new ProfileColorProperty( membraneChannels, 'phosphateColor', {
    default: 'rgb(123,104,238)'
  } ),
  carbonDioxideColorProperty: new ProfileColorProperty( membraneChannels, 'CO2BarChartColor', {
    default: 'rgb(95,80,69)'
  } ),
  sodiumIonColorProperty: new ProfileColorProperty( membraneChannels, 'NaBarChartColor', {
    default: 'rgb(255,255,11)'
  } ),
  potassiumIonColorProperty: new ProfileColorProperty( membraneChannels, 'KBarChartColor', {
    default: 'rgb(32,255,253)'
  } ),
  glucoseColorProperty: new ProfileColorProperty( membraneChannels, 'glucoseBarChartColor', {
    default: 'rgb(106,42,211)'
  } ),
  lipidTailColorProperty: new ProfileColorProperty( membraneChannels, 'lipidTailColor', {
    default: 'rgb(229,68,143)'
  } ),
  lipidHeadColorProperty: new ProfileColorProperty( membraneChannels, 'lipidHeadColor', {
    default: 'rgb(248,161,46)'
  } ),
  atpColorProperty: new ProfileColorProperty( membraneChannels, 'atpColorProperty', {
    default: 'rgb(59,147,74)'
  } ),
  phospholipidHeadColorProperty: new ProfileColorProperty( membraneChannels, 'phospholipidHeadColor', {
    default: 'rgb(220,120,39)'
  } ),
  phospholipidTailColorProperty: new ProfileColorProperty( membraneChannels, 'phospholipidTailColor', {
    default: 'rgb(234,144,255)'
  } ),
  ligandButtonColorProperty: new ProfileColorProperty( membraneChannels, 'ligandButtonColor', {
    default: 'rgb(224,200,88)'
  } )
};

membraneChannels.register( 'MembraneChannelsColors', MembraneChannelsColors );
export default MembraneChannelsColors;