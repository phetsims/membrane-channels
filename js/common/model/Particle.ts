// Copyright 2025, University of Colorado Boulder

/**
 * The model for a particle in membrane channels.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import MembraneChannelsConstants from '../../common/MembraneChannelsConstants.js';
import membraneChannels from '../../membraneChannels.js';
import MembraneChannelsModel from './MembraneChannelsModel.js';
import SoluteType, { getSoluteModelWidth, ParticleType } from './SoluteType.js';

// We'll use a base "random walk speed" for solutes
const randomWalkSpeed = 10;

/**
 * Helper function: gets the "current" interpolated direction based on how
 * far we've turned so far, so we can store or use it if we choose a new target.
 */
function getInterpolatedDirection( solute: Particle<ParticleType> ): Vector2 {
  const alpha = Utils.clamp( solute.turnElapsed / solute.turnDuration, 0, 1 );
  return solute.currentDirection.blend( solute.targetDirection, alpha ).normalized();
}

/**
 * Solute class for Membrane Channels sim, supporting multiple modes of motion,
 * including a smooth "curved" random walk.
 */
export default class Particle<T extends ParticleType> {

  // Possible modes of motion:
  //   - 'randomWalk'  -> same as 'delayedWalk' but direction changes are gradual
  //   - 'bound'              -> solute is bound (for example, to a channel)
  // TODO: Do we need a subclass for Particles that can be userControlled (like ligands)?
  public mode:
    'randomWalk' |
    'bound' |
    'passThroughToInside' |
    'passThroughToOutside' |
    'moveToCenterOfNearestChannel' |
    'userControlled' |
    'userOver' = 'randomWalk';

  // =============================================================
  // FIELDS FOR SMOOTH, DELAYED RANDOM WALK
  // =============================================================

  // Current direction of travel. This vector is usually normalized (length 1).
  public currentDirection: Vector2;

  // The new direction we will gradually turn toward.
  public targetDirection: Vector2;

  // How long (in seconds) it takes to fully rotate from currentDirection to targetDirection.
  public turnDuration: number;

  // How much time (in seconds) has elapsed in the current "turn" from currentDirection to targetDirection.
  public turnElapsed: number;

  // How long (in seconds) we continue traveling before choosing a new targetDirection.
  public timeUntilNextDirection: number;

  // Size of the solute in model coordinates.
  public readonly dimension: Dimension2;

  public constructor(
    public readonly position: Vector2,
    public readonly type: T
  ) {
    this.dimension = new Dimension2(
      getSoluteModelWidth( type ),
      getSoluteModelWidth( type ) / MembraneChannelsConstants.SOLUTE_ASPECT_RATIO_MAP[ type ]
    );

    // For smooth turning, initialize both directions to something random.
    this.currentDirection = Particle.createRandomUnitVector();
    this.targetDirection = Particle.createRandomUnitVector();

    // Initialize how long it takes to turn (e.g., 0.5 to 1.5 seconds).
    this.turnDuration = dotRandom.nextDoubleBetween( 0.5, 1.5 );
    this.turnElapsed = 0;

    // After 1–4 seconds, we’ll pick a new direction and smoothly turn to it.
    this.timeUntilNextDirection = dotRandom.nextDoubleBetween( 1, 4 );
  }

  /**
   * Make the solute move toward a target location right away. It will continue to move in that direction for the
   * specified duration.
   *
   * While moving toward the destination, the solute will be in 'randomWalk' mode.
   */
  public moveToward( target: Vector2, duration: number ): void {
    this.mode = 'randomWalk';

    this.currentDirection = target;
    this.targetDirection = target;
    this.timeUntilNextDirection = duration;
  }

  public step( dt: number, model: MembraneChannelsModel ): void {
    if ( this.mode === 'randomWalk' ) {
      this.stepRandomWalk( dt, model );
    }
    else if ( this.mode === 'bound' ) {
      // Mode where solute doesn’t move, or does something special
    }
    else if ( this.mode === 'moveToCenterOfNearestChannel' ) {
      // Mode where solute moves toward the center of the nearest channel
      const nearestChannelPosition = model.getNearestChannelPosition( this.position.x );
      if ( typeof nearestChannelPosition === 'number' ) {
        const currentPositionX = this.position.x;
        const targetPositionX = nearestChannelPosition;

        const speed = 10 * dt;
        // move in the x direction toward the target
        this.position.x += Math.sign( targetPositionX - currentPositionX ) * speed;

        // If we're close enough to the target, switch to random walk mode
        if ( Math.abs( targetPositionX - currentPositionX ) <= speed ) {

          // Are we above (y>0) or below (y<0) the membrane region?
          const outsideOfCell = this.position.y > 0;

          this.mode = outsideOfCell ? 'passThroughToInside' : 'passThroughToOutside';
        }
      }
      else {
        this.mode = 'randomWalk';
      }
    }
    else if ( this.mode === 'passThroughToInside' ) {
      // Mode where solute passes through the membrane to the inside
      this.position.y -= 5 * dt;

      // TODO: Solutes are supposed to do a constrained random walk through the membrane.
      if ( ( this.position.y + this.dimension.height / 2 ) < MembraneChannelsConstants.MEMBRANE_BOUNDS.minY ) {

        // The next direction should mostly point down so that the solute doesn't go right back out
        const downwardDirection = new Vector2( dotRandom.nextDoubleBetween( -1, 1 ), dotRandom.nextDoubleBetween( -1, 0 ) ).normalize();
        this.moveToward( downwardDirection, dotRandom.nextDoubleBetween( 1, 2 ) );
      }
    }
    else if ( this.mode === 'passThroughToOutside' ) {
      // Mode where solute passes through the membrane to the outside
      this.position.y += 5 * dt;
      if ( ( this.position.y - this.dimension.height / 2 ) > MembraneChannelsConstants.MEMBRANE_BOUNDS.maxY ) {

        const upwardDirection = new Vector2( dotRandom.nextDoubleBetween( -1, 1 ), dotRandom.nextDoubleBetween( 0, 1 ) ).normalize();
        this.moveToward( upwardDirection, dotRandom.nextDoubleBetween( 1, 2 ) );
      }
    }
  }

  /**
   * Step the solute along a random walk path, causing it to bounce off the
   * membrane (central horizontal band) AND also bounce off the bounding walls.
   */
  public stepRandomWalk( dt: number, model: MembraneChannelsModel ): void {

    // 1) Possibly update direction choices
    this.timeUntilNextDirection -= dt;
    if ( this.timeUntilNextDirection <= 0 ) {

      // finalize "currentDirection" from the previous interpolation
      this.currentDirection = getInterpolatedDirection( this );

      // choose a new target direction randomly
      this.targetDirection = Particle.createRandomUnitVector();

      // decide how long to turn to this target
      this.turnDuration = dotRandom.nextDoubleBetween( 0.5, 1.5 );
      this.turnElapsed = 0;

      // reset the time until next direction change
      this.timeUntilNextDirection = dotRandom.nextDoubleBetween( 1, 4 );
    }

    // 2) Accumulate turn time and compute interpolated direction
    this.turnElapsed += dt;
    const alpha = Utils.clamp( this.turnElapsed / this.turnDuration, 0, 1 );
    const direction = this.currentDirection.blend( this.targetDirection, alpha );

    // 3) If the this is overlapping the membrane, bounce off of it
    //    (this is the original membrane-bounce logic).
    const thisBounds = this.getBounds();

    // Are we above (y>0) or below (y<0) the membrane region?
    const outsideOfCell = this.position.y > 0;

    // Check overlap with membrane bounds
    if ( MembraneChannelsConstants.MEMBRANE_BOUNDS.intersectsBounds( thisBounds ) ) {

      // Oxygen and carbon dioxide this can pass through the membrane
      if ( this.type === 'oxygen' || this.type === 'carbonDioxide' ) {

        if ( model.canDiffuseThroughMembrane( this ) && dotRandom.nextDouble() < 0.90 ) {
          this.mode = outsideOfCell ? 'passThroughToInside' : 'passThroughToOutside';

          return;
        }
      }

      if ( this.type === 'sodiumIon' && model.isCloseToSodiumChannel( this ) ) {
        this.mode = 'moveToCenterOfNearestChannel';
        return;
      }

      if ( outsideOfCell ) {

        // Overlap with the membrane from above
        const overlap = MembraneChannelsConstants.MEMBRANE_BOUNDS.maxY - thisBounds.minY;

        // push the this back out of the membrane
        this.position.y += overlap;

        // Reflect the motion upward
        direction.y = Math.abs( direction.y );
        this.currentDirection.y = Math.abs( this.currentDirection.y );
        this.targetDirection.y = Math.abs( this.targetDirection.y );
      }
      else {

        // Overlap with the membrane from below
        const overlap = thisBounds.maxY - MembraneChannelsConstants.MEMBRANE_BOUNDS.minY;

        // push the this back out of the membrane
        this.position.y -= overlap;

        // Reflect the motion downward
        direction.y = -Math.abs( direction.y );
        this.currentDirection.y = -Math.abs( this.currentDirection.y );
        this.targetDirection.y = -Math.abs( this.targetDirection.y );
      }
    }

    // 4) Move the this according to the direction and speed
    //    (do this AFTER membrane collisions are handled).
    const speed = dt * 3;
    this.position.x += direction.x * speed * randomWalkSpeed;
    this.position.y += direction.y * speed * randomWalkSpeed;

    // 5) Now bounce off the 3 other walls in whichever bounding region we are in
    //    (INSIDE_CELL_BOUNDS if y<0, or OUTSIDE_CELL_BOUNDS if y>0).
    const boundingRegion = outsideOfCell ?
                           MembraneChannelsConstants.OUTSIDE_CELL_BOUNDS :
                           MembraneChannelsConstants.INSIDE_CELL_BOUNDS;

    // Recompute thisBounds after the move
    const updatedBounds = this.getBounds();

    // Collide with left wall
    if ( updatedBounds.minX < boundingRegion.minX ) {
      this.position.x += boundingRegion.minX - updatedBounds.minX;
      direction.x = Math.abs( direction.x );
      this.currentDirection.x = Math.abs( this.currentDirection.x );
      this.targetDirection.x = Math.abs( this.targetDirection.x );
    }

    // Collide with right wall
    if ( updatedBounds.maxX > boundingRegion.maxX ) {
      this.position.x -= updatedBounds.maxX - boundingRegion.maxX;
      direction.x = -Math.abs( direction.x );
      this.currentDirection.x = -Math.abs( this.currentDirection.x );
      this.targetDirection.x = -Math.abs( this.targetDirection.x );
    }

    // Collide with bottom wall
    if ( updatedBounds.minY < boundingRegion.minY ) {
      this.position.y += boundingRegion.minY - updatedBounds.minY;
      direction.y = Math.abs( direction.y );
      this.currentDirection.y = Math.abs( this.currentDirection.y );
      this.targetDirection.y = Math.abs( this.targetDirection.y );
    }

    // Collide with top wall
    if ( updatedBounds.maxY > boundingRegion.maxY ) {
      this.position.y -= updatedBounds.maxY - boundingRegion.maxY;
      direction.y = -Math.abs( direction.y );
      this.currentDirection.y = -Math.abs( this.currentDirection.y );
      this.targetDirection.y = -Math.abs( this.targetDirection.y );
    }
  }

  public getBounds(): Bounds2 {
    return this.dimension.toBounds(
      this.position.x - this.dimension.width / 2,
      this.position.y - this.dimension.height / 2
    );
  }

  public static createRandomUnitVector(): Vector2 {
    // Create a random direction by picking a random angle between 0 and 2π.
    const angle = dotRandom.nextDouble() * 2 * Math.PI;
    return new Vector2( Math.cos( angle ), Math.sin( angle ) );
  }

  /**
   * Individual Solute instances are not PhET-iO Instrumented. Instead, the container that contains the Solutes
   * calls ParticleIO.toStateObject to serialize the Solute instances. MembraneChannelsModel uses reference type serialization
   * as a composite of the Solutes, which use data type serialization.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly ParticleIO = new IOType<Particle<ParticleType>, SoluteStateObject>( 'ParticleIO', {
    valueType: Particle,
    stateSchema: {
      position: Vector2.Vector2IO,
      type: StringIO
    },
    fromStateObject: ( stateObject: SoluteStateObject ) => {
      return new Particle(
        new Vector2( stateObject.position.x, stateObject.position.y ),
        stateObject.type
      );
    }
  } );
}

export type SoluteStateObject = {
  position: Vector2;
  type: SoluteType;
};

membraneChannels.register( 'Particle', Particle );