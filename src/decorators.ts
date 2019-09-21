import { defineMarker, getMarkers, hasMarkers, Markers, PropertyKey, PropMarkers, setMetadata } from './utils';

export enum Formats {
	Date = 'date',
	Time = 'time',
	DateTime = 'date-time',
	URI = 'uri',
	Email = 'email',
	Hostname = 'hostname',
	IPv4 = 'ipv4',
	IPv6 = 'ipv6',
	Regex = 'regex'
}

type ExamplesType = {[key: string]: {value: any}};
type BasicType = string | number | boolean | RegExp | Object;
type BasicFunction = () => BasicType;

export const NestedItems = defineMarker<Markers[]>();
export const Required = defineMarker<boolean>(true);
export const UniqueItems = defineMarker<boolean>(true);
export const Minimum = defineMarker<number>();
export const Maximum = defineMarker<number>();
export const ExclusiveMinimum = defineMarker<number>();
export const ExclusiveMaximum = defineMarker<number>();
export const MultipleOf = defineMarker<number>();
export const MaxLength = defineMarker<number>();
export const MinLength = defineMarker<number>();
export const Format = defineMarker<Formats>();
export const Pattern = defineMarker<RegExp>();
export const Enum = defineMarker<Object | (string | number)[]>();
export const MaxItems = defineMarker<number>();
export const MinItems = defineMarker<number>();
export const Default = defineMarker<BasicType | BasicType[] | BasicFunction>();
export const Example = defineMarker<BasicType>();
export const Examples = defineMarker<ExamplesType>();
export const Description = defineMarker<string>();
export const Nullable = defineMarker<boolean>(true);

export function Prop<T extends Object>(type?: T) {
	const self = Prop;
	return function (target: Object, propertyKey: PropertyKey) {
		let detectedType = Reflect.getMetadata('design:type', target, propertyKey);
		setMetadata<T>(self, type || detectedType, target, propertyKey);
	}
}

export function Items<T extends Object>(type?: T) {
	const self = Items;
	const chain: PropMarkers[] = [];

	if (hasMarkers(type) && getMarkers(type).has('items')) {
		const itemsMarkers = getMarkers(type).get('items') as PropMarkers;
		chain.push(itemsMarkers);

		if (itemsMarkers.has(Items)) {
			chain.push(...itemsMarkers.get(NestedItems));
		}
	}

	return function (target: Object, propertyKey: PropertyKey) {
		setMetadata<T | true>(self, type || true, target, propertyKey);
		setMetadata<PropMarkers[]>(NestedItems, chain, target, propertyKey);
	}
}