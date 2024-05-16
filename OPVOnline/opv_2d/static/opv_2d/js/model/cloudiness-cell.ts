/*
* В данном файле содержится реализация класса, который соответствует клетке с информацией об облачности.
*/

class CloudinessCell {
	private geomagneticLatitude: number

	private mlt: number

	public static firstCloudinessCell = new CloudinessCell(0, 0)

	public static secondCloudinessCell = new CloudinessCell(0, 0)

	public static thirdCloudinessCell = new CloudinessCell(0, 0)

	public static fourthCloudinessCell = new CloudinessCell(0, 0)

	private constructor(geomagneticLatitude: number, mlt: number) {
		this.geomagneticLatitude = geomagneticLatitude
		this.mlt = mlt
	}

	public set(geomagneticLatitude: number, mlt: number): void {
		this.geomagneticLatitude = geomagneticLatitude
		this.mlt = mlt
	}

	public getStandardPolarDistance(displayWidth: number): number {
		return (90 - this.geomagneticLatitude) / 80 * displayWidth
	}

	public getStandardPolarAngle(): number {
		return (this.mlt - 6) * Math.PI / 12
	}

	public getStandardX(displayWidth: number): number {
		return this.getStandardPolarDistance(displayWidth)
			* Math.cos(this.getStandardPolarAngle())
	}

	public getStandardY(displayWidth: number): number {
		return this.getStandardPolarDistance(displayWidth)
			* Math.sin(this.getStandardPolarAngle())
	}

	public static getColor(value: number) {
		return new Color(220, 220, 220, value / 100)
	}
}