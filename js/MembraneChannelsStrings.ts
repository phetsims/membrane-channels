// Copyright 2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import membraneChannels from './membraneChannels.js';

type StringsType = {
  'membrane-channels': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'nameStringProperty': LocalizedStringProperty;
  }
};

const MembraneChannelsStrings = getStringModule( 'MEMBRANE_CHANNELS' ) as StringsType;

membraneChannels.register( 'MembraneChannelsStrings', MembraneChannelsStrings );

export default MembraneChannelsStrings;
