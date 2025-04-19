///////////////////////////////////
//        file: NoiseGenerator.js//
//      author: Steven Sproule   //
//      e-mail: sasproule@mun.ca //
//  student id: 201918430        //
//     version: 1                //
// ----------------------------- //
// description: generates a map  //
// of noise values as floats     //
// from 0-1 generated via        //
// simplex noise.                //
///////////////////////////////////

import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

export class NoiseGenerator
{
	constructor(seed = Math.random())
	{
		this.seed = seed;
		this.simplex = new SimplexNoise({ seed: this.seed });

		// Add random offsets to sampling window
		this.offsetX = Math.random() * 10000;
		this.offsetZ = Math.random() * 10000;
	}

	// Generate a 2D array of height values between 0 and 1
	generateNoiseMap(length, width, options = {})
	{
		const {
			scale = 0.1,         // Lower = more zoomed-in noise
			octaves = 4,
			persistence = 0.5,
			lacunarity = 2.0,
		} = options;

		const noiseMap = [];

		for (let x = 0; x < length; x++)
		{
			noiseMap[x] = [];

			for (let z = 0; z < width; z++)
			{
				let amplitude = 1;
				let frequency = 1;
				let noiseHeight = 0;

				for (let o = 0; o < octaves; o++)
				{
					const sampleX = x * scale * frequency + this.offsetX;
					const sampleZ = z * scale * frequency + this.offsetZ;

					const value = this.simplex.noise2D(sampleX, sampleZ);
					noiseHeight += value * amplitude;

					amplitude *= persistence;
					frequency *= lacunarity;
				}

				// Normalize to 0..1
				noiseMap[x][z] = (noiseHeight + 1) / 2;
			}
		}

		return noiseMap;
	}
}
