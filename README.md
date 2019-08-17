# @wssz/modeler
Easy expandable lib for decorating object's properties.

See my plugins:
* [@wssz/modeler-jsonschema](https://github.com/wszerad/wssz-modeler-jsonschema)
* more soon...
* Or create yourself :D

## Usage

* Custom decorator 
```ts
const CustomMarker = defineMarker<String>();
class CustomClass {
    @CustomMarker('test')
    p: any;
}

getMarkers(CustomClass)     // class constructor to inspect
    .get('p')               // desired property key
    .get(CustomMarker))     // data stored of provided decorator
                            // return 'test'
```

* Build-in "@Type" decorator

```ts
class Example {
    @Type()
    simpleType: string;
    
    @Type(String)
    overwrittenType: any
}

getMarkers(CustomClass).get('simpleType').get(Type))        // String
getMarkers(CustomClass).get('overwrittenType').get(Type))   // also String
```

## Methods and build-in decorators

#### defineMarker<OptionsType>(options: OptionsType): Decorator
* create new decorator

#### getMarkers(classConstructor): Map<propKey, Map<Decorator, [OptionsType]>>
* return data stored in class

#### hasMarkers(classConstructor):Boolean
* return true if there are data stored in class
 
#### Decorators
```ts
@Type<any>
@ArrayType<any>
@UniqueItems<>
@Examples<ExamplesType>
@Required<>
@Minimum<number>
@Maximum<number>
@ExclusiveMinimum<number>
@ExclusiveMaximum<number>
@MultipleOf<number>
@MaxLength<number>
@MinLength<number>
@Format<Formats>
@Pattern<RegExp>
@Enum<>
@MaxItems<number>
@MinItems<number>
@Default<any>
@Example<any>
@Description<any>

type ExamplesType = {[key: string]: {value: any}};

enum Formats {
    Date = 'date',
    Time = 'time',
    DateTime = 'date-time',
    URI = 'uri',
    Email = 'email',
    Hostname = 'hostname',
    IPv4 = 'ipv4',
    IPv6 = 'ipv6',
    Regex = 'reqex'
}
```