import { defineMarker, setMetadata } from './utils';

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

export function Type(data?: any) {
	const self = Type;
	return function (target: any, propertyKey: any) {
		let detectedType = Reflect.getMetadata('design:type', target, propertyKey);
		setMetadata<any>(self, data || detectedType, target, propertyKey);
	}
}

export const Required = defineMarker<undefined>();
export const Minimum = defineMarker<number>();
export const Maximum = defineMarker<number>();
export const ExclusiveMinimum = defineMarker<number>();
export const ExclusiveMaximum = defineMarker<number>();
export const MultipleOf = defineMarker<number>();
export const MaxLength = defineMarker<number>();
export const MinLength = defineMarker<number>();
export const Format = defineMarker<Formats>();
export const Pattern = defineMarker<RegExp>();
export const Enum = defineMarker<any[] | Object>();
export const MaxItems = defineMarker<number>();
export const MinItems = defineMarker<number>();
export const Default = defineMarker<any>();
export const Example = defineMarker<any>();
export const ArrayType = defineMarker<any>();
export const UniqueItems = defineMarker<undefined>();
export const Examples = defineMarker<ExamplesType>();
export const Description = defineMarker<string>();