import 'mocha';
import 'reflect-metadata';
import { expect } from 'chai';
import { defineMarker, Description, getMarkers, Type } from '../index';

class OtherClass {

}

class TestClass {
	@Description('test')
	@Type()
	pString: string;

	@Type(OtherClass)
	pOther: OtherClass;

	pInvisible: number;
}

describe('tests', () => {
	describe('marker', () => {
		it('should contain marked properties', () => {
			expect(getMarkers(TestClass).size).to.equal(2);
		});

		it('should return marked properties names', () => {
			expect(Array.from(getMarkers(TestClass).keys())).to.eql(['pString', 'pOther']);
		});

		it('should return stored data of decorator', () => {
			expect(getMarkers(TestClass).get('pString').get(Description)).to.equal('test');
		});
	});

	describe('@Type', () => {
		it('should return basic type', () => {
			expect(getMarkers(TestClass).get('pString').get(Type)).to.equal(String);
		});

		it('should return extended type', () => {
			expect(getMarkers(TestClass).get('pOther').get(Type)).to.equal(OtherClass);
		});
	});

	describe('tests', () => {
		it('should create marker and be able to read stored data', () => {
			const CustomMarker = defineMarker<string>();
			class CustomClass {
				@CustomMarker('test')
				p: any;
			}

			expect(getMarkers(CustomClass).get('p').get(CustomMarker)).to.equal('test');
		});
	});
});