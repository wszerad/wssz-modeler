import 'mocha';
import 'reflect-metadata';
import { expect } from 'chai';
import {
	Attach,
	defineMarker,
	Description,
	getMarkers,
	Items,
	NestedItems,
	Prop,
	Required
} from '../index';
import { ArrayItems } from '../src/ArrayItems';

class OtherClass {}

class LevelLevel extends ArrayItems {
	@Items(Date)
	@Prop() items: Date[];
}

class Level extends ArrayItems {
	@Items(LevelLevel)
	@Prop() items: Date[][];
}

class TestClass {
	@Description('test')
	@Prop() pString: string;

	@Prop(OtherClass) pOther: OtherClass;

	@Required() pRequired: boolean;

	@Items() pArray: string[];

	@Items(Level) pNestedArray: Date[][][];

	pInvisible: number;

	@Attach([Prop(), Required()]) pAttach: boolean;
}

describe('tests', () => {
	describe('marker', () => {
		it('should contain marked properties', () => {
			expect(getMarkers(TestClass).size).to.equal(6);
		});

		it('should contain marked properties extracted by class-name', () => {
			expect(getMarkers(TestClass.name).size).to.equal(6);
		});

		it('should return marked properties names', () => {
			expect(Array.from(getMarkers(TestClass).keys())).to.eql(['pString', 'pOther', 'pRequired', 'pArray', 'pNestedArray', 'pAttach']);
		});

		it('should return stored data of decorator', () => {
			expect(getMarkers(TestClass).get('pString').get(Description)).to.equal('test');
		});

		it('should return static data of required', () => {
			expect(getMarkers(TestClass).get('pRequired').get(Required)).to.equal(true);
		});
	});

	describe('@Prop', () => {
		it('should return basic type', () => {
			expect(getMarkers(TestClass).get('pString').get(Prop)).to.equal(String);
		});

		it('should return extended type', () => {
			expect(getMarkers(TestClass).get('pOther').get(Prop)).to.equal(OtherClass);
		});
	});

	describe('@Items', () => {
		it('should return basic array', () => {
			expect(getMarkers(TestClass).get('pArray').get(Items)).to.equal(true);
			expect(getMarkers(TestClass).get('pArray').get(NestedItems)).to.have.lengthOf(0);
		});

		it('should return nested array', () => {
			expect(getMarkers(TestClass).get('pNestedArray').get(Items)).to.equal(Level);
			expect(getMarkers(TestClass).get('pNestedArray').get(NestedItems)).to.have.lengthOf(2);
		});
	});

	describe('@Attach', () => {
		it('should return basic type', () => {
			expect(getMarkers(TestClass).get('pAttach').get(Prop)).to.equal(Boolean);
		});

		it('should return attached decorator', () => {
			expect(getMarkers(TestClass).get('pAttach').get(Required)).to.equal(true);
		});
	});

	describe('custom marker', () => {
		it('should create marker and be able to read stored data', () => {
			const CustomMarker = defineMarker<string>();
			const CustomMarker2 = defineMarker<string>('pies');

			class CustomClass {
				@CustomMarker2()
				@CustomMarker('test')
				p: any;
			}

			expect(getMarkers(CustomClass).get('p').get(CustomMarker)).to.equal('test');
			expect(getMarkers(CustomClass).get('p').get(CustomMarker2)).to.equal('pies');
		});
	});
});