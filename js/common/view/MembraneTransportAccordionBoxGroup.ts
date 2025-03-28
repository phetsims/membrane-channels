// Copyright 2025, University of Colorado Boulder

import Emitter from '../../../../axon/js/Emitter.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ParallelDOM from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import membraneTransport from '../../membraneTransport.js';
import MembraneTransportStrings from '../../MembraneTransportStrings.js';
import MembraneTransportModel from '../model/MembraneTransportModel.js';
import ChannelType from '../model/proteins/ChannelType.js';
import ChannelToolNode from './ChannelToolNode.js';
import LigandControl from './LigandControl.js';
import MembranePotentialPanel from './MembranePotentialPanel.js';
import MembraneTransportScreenView from './MembraneTransportScreenView.js';

// Type definition for channel configuration
type ChannelConfig = {
  channelType: ChannelType;
  labelProperty: TReadOnlyProperty<string>;
  accessibleNameProperty: TReadOnlyProperty<string>;
};

// Type definition for accordion box configuration
type AccordionBoxConfig = {
  titleProperty: TReadOnlyProperty<string>;
  tandemName: string;
  expanded: boolean;
  channels: ChannelConfig[];
};

/**
 * Shows the title and group of accordion boxes for the membrane channels, which can be dragged into the play area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// TODO: Rename this file
export default class MembraneTransportAccordionBoxGroup extends Panel {
  public readonly resetEmitter = new Emitter();

  // So we can return ChannelDragNode instances to their corresponding ChannelToolNode icons
  private readonly channelToolNodes: Map<ChannelType, ChannelToolNode>;

  public constructor( model: MembraneTransportModel, tandem: Tandem, view: MembraneTransportScreenView ) {

    const fontSize = 14;

    const panels: Panel[] = [];

    // put all titles in an align box so they take up the same amount of space
    const titleAlignGroup = new AlignGroup();

    const channelToolNodes = new Map<ChannelType, ChannelToolNode>();

    /**
     * Creates an accordion box based on the provided configuration
     */
    const createPanel = ( config: AccordionBoxConfig, ...additionalControls: Node[] ): Panel => {
      const content = new HBox( {
        spacing: 10,
        children: config.channels.map( channel => {
            const channelToolNode = new ChannelToolNode(
              channel.channelType,
              channel.labelProperty,
              channel.accessibleNameProperty,
              view
            );
            channelToolNodes.set( channel.channelType, channelToolNode );
            return channelToolNode;
          }
        )
      } );

      // TODO: Get rid of the accordion boxes, they will just be labels and always open.
      return new Panel( new VBox( {
        spacing: 5, // spacing between the title and the content
        children: [
          titleAlignGroup.createBox( new Text( config.titleProperty, { fontSize: fontSize, maxWidth: 150 } ), { xAlign: 'left' } ),
          // contentAlignGroup.createBox( content ),
          content,
          ...additionalControls
        ]
      } ), {
        cornerRadius: 0,
        stroke: null
      } );
    };

    if ( model.featureSet === 'facilitatedDiffusion' || model.featureSet === 'playground' ) {

      // Leakage channels
      const leakageAccordionBox = createPanel( {
        titleProperty: MembraneTransportStrings.leakageChannelsStringProperty,
        tandemName: 'leakageChannelsAccordionBox',
        expanded: true,
        channels: [
          {
            channelType: 'sodiumIonLeakageChannel',
            labelProperty: new StringProperty( 'Na+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.leakageChannelsAccordionBox.sodiumIonNaPlusLeakageStringProperty
          },
          {
            channelType: 'potassiumIonLeakageChannel',
            labelProperty: new StringProperty( 'K+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.leakageChannelsAccordionBox.potassiumIonKPlusLeakageStringProperty
          }
        ]
      } );

      // Voltage-gated channels
      const voltageGatedAccordionBox = createPanel( {
        titleProperty: MembraneTransportStrings.voltageGatedChannelsStringProperty,
        tandemName: 'voltageGatedChannelsAccordionBox',
          expanded: true,
        channels: [
          {
            channelType: 'sodiumIonVoltageGatedChannel',
            labelProperty: new StringProperty( 'Na+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.voltageGatedChannelsAccordionBox.sodiumIonNaPlusVoltageGatedStringProperty
          },
          {
            channelType: 'potassiumIonVoltageGatedChannel',
            labelProperty: new StringProperty( 'K+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.voltageGatedChannelsAccordionBox.potassiumIonKPlusVoltageGatedStringProperty
          }
        ]
        },
        new MembranePotentialPanel( model, tandem.createTandem( 'membranePotentialPanel' ) )
      );

      // Ligand-gated channels
      const ligandGatedAccordionBox = createPanel( {
        titleProperty: MembraneTransportStrings.ligandGatedChannelsStringProperty,
        tandemName: 'ligandGatedChannelsAccordionBox',
        expanded: true,
        channels: [
          {
            channelType: 'sodiumIonLigandGatedChannel',
            labelProperty: new StringProperty( 'Na+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.ligandGatedAccordionBox.sodiumIonNaPlusLigandGatedStringProperty
          },
          {
            channelType: 'potassiumIonLigandGatedChannel',
            labelProperty: new StringProperty( 'K+' ), // TODO: i18n
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.ligandGatedAccordionBox.potassiumIonKPlusLigandGatedStringProperty
          }
        ]
      }, new LigandControl( model, tandem.createTandem( 'myLigandToggleButton' ) ) ); // TODO: fix tandem

      panels.push(
        leakageAccordionBox,
        voltageGatedAccordionBox,
        ligandGatedAccordionBox
      );
    }

    if ( model.featureSet === 'activeTransport' || model.featureSet === 'playground' ) {
      // Active transport channels
      const activeTransportAccordionBox = createPanel( {
        titleProperty: MembraneTransportStrings.activeTransportersStringProperty,
        tandemName: 'activeTransportersAccordionBox',
        expanded: true,
        channels: [
          {
            channelType: 'sodiumPotassiumPump',
            labelProperty: MembraneTransportStrings.NaPlusKPlusPumpStringProperty,
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.activeTransportersAccordionBox.sodiumPotassiumPumpStringProperty
          },
          {
            channelType: 'sodiumGlucoseCotransporter',
            labelProperty: MembraneTransportStrings.sodiumGlucoseCotransporterStringProperty,
            accessibleNameProperty: MembraneTransportStrings.a11y.accordionBoxGroup.activeTransportersAccordionBox.sodiumGlucoseCotransporterStringProperty
          }
        ]
      } );

      panels.push( activeTransportAccordionBox );
    }

    const interleaveHSeparators = ( nodes: Node[] ) => {
      const result: Node[] = [];
      for ( let i = 0; i < nodes.length; i++ ) {
        if ( i > 0 ) {
          result.push( new HSeparator( { stroke: 'lightGray', lineWidth: 1 } ) );
        }
        result.push( nodes[ i ] );
      }
      return result;
    };
    const vbox = new VBox( {
      spacing: 0,
      children: interleaveHSeparators( panels )
    } );
    super( vbox, {
      tagName: 'div',
      labelTagName: 'h3',
      accessibleName: MembraneTransportStrings.a11y.accordionBoxGroup.transportProteinsStringProperty,
      accessibleHelpText: MembraneTransportStrings.a11y.accordionBoxGroup.accessibleHelpTextStringProperty,
      accessibleHelpTextBehavior: ParallelDOM.HELP_TEXT_BEFORE_CONTENT
    } );

    this.mutate( { left: 20, top: 20 } );
    this.channelToolNodes = channelToolNodes;
  }

  public reset(): void {
    this.resetEmitter.emit();
  }

  public getChannelToolNode( channelType: ChannelType ): ChannelToolNode {
    return this.channelToolNodes.get( channelType )!;
  }
}

membraneTransport.register( 'MembraneTransportAccordionBoxGroup', MembraneTransportAccordionBoxGroup );