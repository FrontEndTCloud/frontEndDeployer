class ExampleClassOfEs6Standard {

  /**
   * @var {String}
   */
  property1 = '1';

  /**
   * @var {Number}
   */
  property2 = 2;

  constructor(prop1, prop2 = 2) {
    this.property1 = prop1;
    this.property2 = prop2;
  }
}