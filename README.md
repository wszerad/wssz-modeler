# @wssz/modeler
Easy expandable lib for decorating object's properties.

See my plugins:
* [@wssz/modeler-parser](https://github.com/wszerad/wssz-modeler-parser)
* [@wssz/modeler-jsonschema](https://github.com/wszerad/wssz-modeler-jsonschema)
* [@wssz/modeler-nestjs](https://github.com/wszerad/wssz-modeler-nestjs)

## Usage

* Custom decorator 
```ts
const CustomMarker = defineMarker<String>();
const CustomMarkerWithStaticValue = defineMarker<String>('flag');

class CustomClass {
    @CustomMarker('test')
    @CustomMarkerWithStaticValue()
    p: any;
}

getMarkers(CustomClass)     // class constructor to inspect
    .get('p')               // desired property key
    // data stored of provided decorator
    .get(CustomMarker))     // return 'test'
    // or
    .get(CustomMarkerWithStaticValue))     // return 'flag'
```

## Build-in decorators
* @Prop(type?)
```ts
class Example {
    @Prop()
    simpleType: string;
    
    @Prop(String)
    overwrittenType: any
}

getMarkers(Example).get('simpleType').get(Prop))        // String
getMarkers(Example).get('overwrittenType').get(Prop))   // also String
```

* @Items(type?) and readonly @NestedItems
```ts
class NestedDate extends ArrayItems {
    @Items(Date)
    items: Date[];
}

class Example {
    @Items()
    simpleType: string[];
    
    @Items(Date)
    dataType: Date[];

    @Items(NestedDate)
    nestedType: Date[][];
}

getMarkers(Example).get('simpleType').get(Items)         // true (if no type specified)
getMarkers(Example).get('dataType').get(Items)           // Date
getMarkers(Example).get('nestedType').get(NestedItems)   // [Markers for each nested level]
getMarkers(Example).get('nestedType')
    .get(NestedItems)[0].get(Items)                      // Date
```

* @Attach(decorators: Function[])
```ts
class Example {
    @Attach([Prop(), Required()])
    simpleType: string;
}

getMarkers(Example).get('simpleType').get(Prop))        // String
getMarkers(Example).get('simpleType').get(Required))    // true
```

## Methods and build-in decorators

#### defineMarker<OptionsType>(options: OptionsType): Decorator
* create new decorator

#### getMarkers(classConstructor | className): Map<propKey, Map<Decorator, [OptionsType]>>
* return data stored in class

#### hasMarkers(classConstructor | className):Boolean
* return true if there are data stored in class
 
#### extractDecoratorMarkers(markers: Map<Decorator, [OptionsType]>, decorator: Function, defaultValue?: any)
* return data for given decorator or defaultValue
 
#### Decorators
```ts
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

Required<boolean = true>
Minimum<number>
Maximum<number>
ExclusiveMinimum<number>
ExclusiveMaximum<number>
MultipleOf<number>
MaxLength<number>
MinLength<number>
Format<Formats>
Pattern<RegExp>
Enum<Object | (string | number)[]>
MaxItems<number>
MinItems<number>
Default<BasicType | BasicType[] | BasicFunction>
Example<BasicType>
UniqueItems<boolean = true>
Examples<ExamplesType>
Description<string>
Nullable<boolean = true>
```
