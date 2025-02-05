// Copyright 2025, University of Colorado Boulder

/**
 * The canvas renderer for background content in the observation window. This is for rendering
 * many particles that are not interactive.
 *
 * TODO: Let's give a more descriptive name
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { CanvasNode, rasterized } from '../../../../scenery/js/imports.js';
import MembraneChannelsColors from '../../common/MembraneChannelsColors.js';
import MembraneChannelsConstants from '../../common/MembraneChannelsConstants.js';
import membraneChannels from '../../membraneChannels.js';
import MembraneChannelsModel from '../model/MembraneChannelsModel.js';
import SoluteType, { SoluteTypes } from '../model/SoluteType.js';
import getSoluteNode from './solutes/getSoluteNode.js';

// Head parameters
const headRadius = 1.3;

// Constants controlling the tail control point movement
const controlPointStepSize = 0.1; // the random component for the change in velocity
const friction = 0.9999;          // a friction coefficient for momentum (0 to 1)

// Introduce a positive-valued "angle" (really a horizontal offset) to separate the two tails
// from each lipid head. Adjust as needed for appearance.
const TAIL_OFFSET = 0.3;

// Define an interface for a control point.
// We add a velocity component "vx" for horizontal momentum.
type ControlPoint = {
  x: number;
  y: number;
  vx: number;
};

// For each tail, we want to store its anchor (head center) and a list of control points.
type TailState = {
  anchorX: number;
  anchorY: number;
  controlPoints: ControlPoint[];
};

export default class BackgroundCanvasNode extends CanvasNode {

  private time = 0;

  // We use separate tail states for inner and outer layers, each with two tails per head.
  private tailStatesInner: TailState[] = [];
  private tailStatesOuter: TailState[] = [];

  private readonly headY: number;

  private readonly soluteTypeToImageMap = new Map<SoluteType, HTMLImageElement>();

  public constructor( private readonly model: MembraneChannelsModel, private readonly modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {
    super( {
      canvasBounds: canvasBounds
    } );

    // So that the edge of the head is at the edge of the bounds.
    this.headY = MembraneChannelsConstants.MEMBRANE_BOUNDS.maxY - headRadius;

    SoluteTypes.forEach( soluteType => {
      this.soluteTypeToImageMap.set( soluteType, this.createImage( soluteType ) );
    } );
    this.initializeTailStates();
  }

  private createImage( soluteType: SoluteType ): HTMLImageElement {

    const iconNode = getSoluteNode( soluteType );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - TODO: Can rasterized return an Image if wrap is false?
    // public rasterized( options?: RasterizedOptions & { wrap?: true } ): Node;
    // public rasterized( options: RasterizedOptions & { wrap: false } ): Image;
    return rasterized( iconNode, { wrap: false, resolution: 4 } ).image;
  }

  // Convenience functions to move and line in model coordinates
  private moveTo( context: CanvasRenderingContext2D, x: number, y: number ): void {
    context.moveTo( this.modelViewTransform.modelToViewX( x ), this.modelViewTransform.modelToViewY( y ) );
  }

  private lineTo( context: CanvasRenderingContext2D, x: number, y: number ): void {
    context.lineTo( this.modelViewTransform.modelToViewX( x ), this.modelViewTransform.modelToViewY( y ) );
  }

  private strokeRect( context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number ): void {
    context.strokeRect( this.modelViewTransform.modelToViewX( x ), this.modelViewTransform.modelToViewY( y ), this.modelViewTransform.modelToViewDeltaX( width ), this.modelViewTransform.modelToViewDeltaY( height ) );
  }

  public step( dt: number ): void {
    this.time = this.time + dt;

    this.updateTailStatesFor( dt, this.tailStatesInner );
    this.updateTailStatesFor( dt, this.tailStatesOuter );
  }

  // Initialize two sets of tail states (inner and outer). For each "head" position,
  // we now create two tails instead of one by horizontally offsetting each tail’s anchor.
  private initializeTailStates(): void {

    // TODO: Make sure not too many tails
    for ( let i = -40; i <= 40; i++ ) {

      // For each head, its center is anchorX on the horizontal axis
      const anchorX = i * headRadius * 2;

      // We'll create two separate anchorX positions, each offset by ± TAIL_ANGLE/2
      // so that we have two tails at slightly different angles.
      const anchorXLeft = anchorX - TAIL_OFFSET / 2;
      const anchorXRight = anchorX + TAIL_OFFSET / 2;

      // 1) Inner side: anchorY is -headY
      const innerAnchorY = -this.headY;

      // Tail A (left offset) for the inner side
      const cp1InnerLeft: ControlPoint = { x: anchorXLeft, y: innerAnchorY + this.headY / 2, vx: 0 };
      const cp2InnerLeft: ControlPoint = { x: anchorXLeft, y: innerAnchorY + this.headY, vx: 0 };
      this.tailStatesInner.push( {
        anchorX: anchorXLeft,
        anchorY: innerAnchorY,
        controlPoints: [ cp1InnerLeft, cp2InnerLeft ]
      } );

      // Tail B (right offset) for the inner side
      const cp1InnerRight: ControlPoint = { x: anchorXRight, y: innerAnchorY + this.headY / 2, vx: 0 };
      const cp2InnerRight: ControlPoint = { x: anchorXRight, y: innerAnchorY + this.headY, vx: 0 };
      this.tailStatesInner.push( {
        anchorX: anchorXRight,
        anchorY: innerAnchorY,
        controlPoints: [ cp1InnerRight, cp2InnerRight ]
      } );

      // 2) Outer side: anchorY is +headY
      const outerAnchorY = this.headY;

      // Tail A (left offset) for the outer side
      const cp1OuterLeft: ControlPoint = { x: anchorXLeft, y: outerAnchorY - this.headY / 2, vx: 0 };
      const cp2OuterLeft: ControlPoint = { x: anchorXLeft, y: outerAnchorY - this.headY, vx: 0 };
      this.tailStatesOuter.push( {
        anchorX: anchorXLeft,
        anchorY: outerAnchorY,
        controlPoints: [ cp1OuterLeft, cp2OuterLeft ]
      } );

      // Tail B (right offset) for the outer side
      const cp1OuterRight: ControlPoint = { x: anchorXRight, y: outerAnchorY - this.headY / 2, vx: 0 };
      const cp2OuterRight: ControlPoint = { x: anchorXRight, y: outerAnchorY - this.headY, vx: 0 };
      this.tailStatesOuter.push( {
        anchorX: anchorXRight,
        anchorY: outerAnchorY,
        controlPoints: [ cp1OuterRight, cp2OuterRight ]
      } );
    }
  }

  // Update control point positions via a random walk with momentum, for a given set of tail states.
  private updateTailStatesFor( dt: number, tailStates: TailState[] ): void {
    for ( const state of tailStates ) {
      // Define horizontal bounds relative to the tail's anchor.
      const tailWindowSize = 1;
      const minX = state.anchorX - tailWindowSize;
      const maxX = state.anchorX + tailWindowSize;
      // For each control point, update its x using momentum, leaving y unchanged.
      for ( const cp of state.controlPoints ) {
        cp.vx = cp.vx * friction + ( dotRandom.nextDouble() * 2 - 1 ) * controlPointStepSize * dt;
        cp.x += cp.vx;
        // Clamp the x position to within [anchorX - tailWindowSize, anchorX + tailWindowSize]
        if ( cp.x < minX ) {
          cp.x = minX;
          cp.vx = 0;
        }
        else if ( cp.x > maxX ) {
          cp.x = maxX;
          cp.vx = 0;
        }
      }
    }
  }

  /**
   * Draw tails for the given side ("inner" or "outer").
   */
  public drawTails( context: CanvasRenderingContext2D, side: 'inner' | 'outer' ): void {

    context.strokeStyle = MembraneChannelsColors.lipidTailColorProperty.value.toCSS();
    context.lineWidth = 2;

    // For each tail state, draw a cubic Bézier curve using the anchor, the two control points,
    // and then a tail endpoint defined relative to the last control point.
    // (Adjust the endpoint offset if needed.)
    const OFFSET = 0.8;
    const endpointOffset = side === 'inner' ? -OFFSET : OFFSET;

    const tailStates = side === 'inner' ? this.tailStatesInner : this.tailStatesOuter;

    for ( const state of tailStates ) {
      context.beginPath();

      // The last control point helps define our endpoint
      const lastCP = state.controlPoints[ state.controlPoints.length - 1 ];
      const tailEndX = lastCP.x;
      const tailEndY = lastCP.y + endpointOffset;

      this.moveTo( context, state.anchorX, state.anchorY );
      context.bezierCurveTo(
        this.modelViewTransform.modelToViewX( state.controlPoints[ 0 ].x ), this.modelViewTransform.modelToViewY( state.controlPoints[ 0 ].y ),
        this.modelViewTransform.modelToViewX( state.controlPoints[ 1 ].x ), this.modelViewTransform.modelToViewY( state.controlPoints[ 1 ].y ),
        this.modelViewTransform.modelToViewX( tailEndX ), this.modelViewTransform.modelToViewY( tailEndY )
      );
      context.stroke();
    }
  }

  private drawSolutes( context: CanvasRenderingContext2D ): void {

    // Draw the particles as images
    for ( const solute of this.model.solutes ) {

      // draw image scaled by a factor of 4 in each dimension
      const image = this.soluteTypeToImageMap.get( solute.type )!;
      const x = this.modelViewTransform.modelToViewX( solute.position.x );
      const y = this.modelViewTransform.modelToViewY( solute.position.y );

      // A scale from model to view coordinates.
      const scale = this.modelViewTransform.modelToViewDeltaX( solute.dimension.width ) / image.width;

      const width = image.width * scale;
      const height = image.height * scale;

      // Draw the image centered at the position.
      context.drawImage( image, x - width / 2, y - height / 2, width, height );

      if ( phet.chipper.queryParameters.dev ) {

        // Draw the solute's bounding box
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        this.strokeRect(
          context,
          ( solute.position.x - solute.dimension.width / 2 ),
          ( solute.position.y - solute.dimension.height / 2 ),
          ( solute.dimension.width ),
          ( solute.dimension.height )
        );
      }
    }
  }

  private drawCharges( context: CanvasRenderingContext2D ): void {
    const potentialString = this.model.membraneVoltagePotentialProperty.value;
    const potentialNumber = potentialString === '-70' ? -70 :
                            potentialString === '-50' ? -50 :
                            30;

    const numberOfCharges = Utils.roundSymmetric( 18 * Math.abs( potentialNumber ) / 70 );
    const margin = 5;
    const separation = ( MembraneChannelsConstants.MEMBRANE_BOUNDS.width - margin * 2 ) / ( numberOfCharges - 1 );

    for ( let i = 0; i < numberOfCharges; i++ ) {
      this.drawSign( context, potentialNumber < 0 ? '+' : '-', new Vector2( margin + i * separation + MembraneChannelsConstants.MEMBRANE_BOUNDS.minX, 15 ) );
    }
    for ( let i = 0; i < numberOfCharges; i++ ) {
      this.drawSign( context, potentialNumber < 0 ? '-' : '+', new Vector2( margin + i * separation + MembraneChannelsConstants.MEMBRANE_BOUNDS.minX, -15 ) );
    }
  }

  /**
   * For debugging, to see where model points are on the canvas.
   * @param context
   * @param point - in model coordinates
   */
  private drawSign( context: CanvasRenderingContext2D, sign: '+' | '-', point: Vector2 ): void {
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    const radius = 2;
    context.beginPath();
    if ( sign === '+' ) {
      this.moveTo( context, point.x, point.y - radius );
      this.lineTo( context, point.x, point.y + radius );
    }
    this.moveTo( context, point.x - radius, point.y );
    this.lineTo( context, point.x + radius, point.y );
    context.stroke();
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    // Draw the background: upper half for outside cell, lower half for inside cell.
    context.fillStyle = MembraneChannelsColors.outsideCellColorProperty.value.toCSS();
    context.fillRect( 0, 0, MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT / 2 );
    context.fillStyle = MembraneChannelsColors.insideCellColorProperty.value.toCSS();
    context.fillRect( 0, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT / 2, MembraneChannelsConstants.OBSERVATION_WINDOW_WIDTH, MembraneChannelsConstants.OBSERVATION_WINDOW_HEIGHT / 2 );

    if ( this.model.isShowingMembranePotentialLabelsProperty.value ) {
      this.drawCharges( context );
    }

    this.drawSolutes( context );

    // Draw tails independently for inner and outer layers (which now each have 2 tails per head).
    this.drawTails( context, 'inner' );
    this.drawTails( context, 'outer' );

    // --- Draw the heads ---
    context.fillStyle = MembraneChannelsColors.lipidHeadColorProperty.value.toCSS();
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    // Draw inner heads
    // TODO: Make sure not too many heads
    for ( let i = -100; i < 100; i++ ) {
      context.beginPath();
      context.arc(
        this.modelViewTransform.modelToViewX( i * headRadius * 2 ),
        this.modelViewTransform.modelToViewY( -this.headY ), // inner heads
        this.modelViewTransform.modelToViewDeltaX( headRadius ),
        0, 2 * Math.PI
      );
      context.fill();
      context.stroke();
    }

    // Draw outer heads
    // TODO: Make sure not too many heads
    for ( let i = -100; i < 100; i++ ) {
      context.beginPath();
      context.arc(
        this.modelViewTransform.modelToViewX( i * headRadius * 2 ),
        this.modelViewTransform.modelToViewY( this.headY ),  // outer heads
        this.modelViewTransform.modelToViewDeltaX( headRadius ),
        0, 2 * Math.PI
      );
      context.fill();
      context.stroke();
    }

    // --- Debugging code to check transforms and bounds ---
    if ( phet.chipper.queryParameters.dev ) {
      this.drawCrosshairsAt( context, new Vector2( 0, 0 ) );
      this.drawCrosshairsAt( context, new Vector2( 0, 10 ) );

      context.strokeStyle = 'red';
      context.lineWidth = 5;

      const outsideBounds = MembraneChannelsConstants.OUTSIDE_CELL_BOUNDS;
      this.strokeRect( context, outsideBounds.minX, outsideBounds.minY, outsideBounds.width, outsideBounds.height );

      const insideBounds = MembraneChannelsConstants.INSIDE_CELL_BOUNDS;
      this.strokeRect( context, insideBounds.minX, insideBounds.minY, insideBounds.width, insideBounds.height );
    }
  }

  /**
   * For debugging, to see where model points are on the canvas.
   * @param context
   * @param point - in model coordinates
   */
  private drawCrosshairsAt( context: CanvasRenderingContext2D, point: Vector2 ): void {
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    this.moveTo( context, point.x, point.y - 5 );
    this.lineTo( context, point.x, point.y + 5 );
    this.moveTo( context, point.x - 5, point.y );
    this.lineTo( context, point.x + 5, point.y );
    context.stroke();
  }
}
membraneChannels.register( 'BackgroundCanvasNode', BackgroundCanvasNode );