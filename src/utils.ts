import 'reflect-metadata';

const markerMeta = Symbol();

export type PropertyKey = string | number;
export type PropMarkers = Map<Function, any>;
export type Markers = Map<PropertyKey, PropMarkers>;

export function defineMarker<S>(staticValue: S): () => Function
export function defineMarker<S>(): (options: S) => Function
export function defineMarker<S>(staticValue?: S) {
	const factored = function (options: S = staticValue) {
		return function (target: any, propertyKey: PropertyKey) {
			setMetadata<S>(factored, options, target, propertyKey);
		};
	};
	return factored;
}

export function setMetadata<S>(self: Function, data: S, target: any, propertyKey: PropertyKey) {
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
	return Reflect.getMetadata(markerMeta, target.prototype);
}

export function hasMarkers(target: any): boolean {
	return Reflect.hasMetadata(markerMeta, target.prototype);
}

export function extractDecoratorMarkers(markers: PropMarkers, decorator: Function) {
	if (!markers.has(decorator)) {
		return;
	}
	return markers.get(decorator);
}

