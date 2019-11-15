import 'reflect-metadata';

export const markerMeta = Symbol.for('modelerMarker');

export type PropertyKey = string | symbol;
export type PropMarkers = Map<Function, any>;
export type Markers = Map<PropertyKey, PropMarkers>;

export function defineMarker<S>(staticValue: S): () => Function
// @ts-ignore
export function defineMarker<S>(): (options: S) => Function
export function defineMarker<S>(staticValue: S) {
	const factored = function (options: S = staticValue) {
		return function (target: any, propertyKey: PropertyKey) {
			setMetadata<S>(factored, options, target, propertyKey);
		};
	};
	return factored;
}

export function setMetadata<S>(self: Function, data: S, target: Object, propertyKey: PropertyKey) {
	let metaData = Reflect.getMetadata(markerMeta, target);

	if (!metaData) {
		metaData = new Map();
		Reflect.defineMetadata(markerMeta, metaData, target)
	}

	let propertyData = metaData.get(propertyKey);

	if (!propertyData) {
		propertyData = new Map();
		metaData.set(propertyKey, propertyData);
	}

	propertyData.set(self, data);
}

export function getMarkers(target: any): Markers {
	if (!target || !target.prototype) {
		return new Map();
	}

	return Reflect.getMetadata(markerMeta, target.prototype);
}

export function hasMarkers(target: any): boolean {
	return target && target.prototype && Reflect.hasMetadata(markerMeta, target.prototype);
}

export function extractDecoratorMarkers(markers: PropMarkers, decorator: Function) {
	if (!markers.has(decorator)) {
		return;
	}
	return markers.get(decorator);
}

