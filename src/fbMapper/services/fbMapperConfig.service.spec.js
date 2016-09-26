import ngResource from 'angular-resource';
import fbMapperConfig from './fbMapperConfig.service';

describe("fbMapperConfig.service", () => {
  var service;

  beforeEach(inject(($injector) => {
    var log = $injector.get("$log");
    var q = $injector.get("$q");
    service = new fbMapperConfig(log, q, ngResource);
  }));


  describe("#setElement", () => {
    it("should add elements to the configuration", () => {
      console.log(service._getElement)
      expect(service._getElement("foo")).toEqual(undefined);
      expect(service._getElement("bar")).toEqual(undefined);

      var fooElement = { name: "foo" };
      service.setElement(fooElement);
      expect(service._getElement("foo")).toEqual(fooElement);
      expect(service._getElement("bar")).toEqual(undefined);

      var barElement = { name: "bar" };
      service.setElement(barElement);
      expect(service._getElement("foo")).toEqual(fooElement);
      expect(service._getElement("bar")).toEqual(barElement);
    });
  });


  describe("#setComposition", () => {

    //   var fooElement = { name: "foo" };
    // it("should not be undefined", () => {
    //   service.setElement(fooElement);
    //   expect(service).not.toEqual(undefined);
    //   expect(service._getElement("foo")).toEqual(fooElement);
    // })

    var fooElement = { name: "foo" };
    var barElement = { name: "bar" };
    var mumbleElement = {
      name: "mumble",
      defaultComposition: () => { return { name: "mumble" }; }
    };

    beforeEach(() => {
      service.setElement(fooElement);
      service.setElement(barElement);
      service.setElement(mumbleElement);
    });


    describe("given a composition including elements", () => {
      var composition = {
        name: "foobar",
        elements: [fooElement, barElement]
      };

      it("should add a new compositon", () => {
        var value = service.setComposition(composition);
        expect(value).toEqual({
          name: "foobar",
          elements: [
            { name: "foo" },
            { name: "bar" }
          ]
        });
        expect(service.getComposition("foobar")).toEqual({
          name: "foobar",
          elements: [
            { name: "foo" },
            { name: "bar" }
          ]
        });
      });
    });

    // describe("given a composition including element names", () => {
    //   var composition = {
    //     name: "foomumble",
    //     elements: [ fooElement, "mumble" ]
    //   };

    //   it("should add an element's default composition", () => {
    //       value = service.setComposition(composition);
    //       expect(value).toEqual({
    //         name: "foomumble",
    //         elements: [
    //           { name: "foo", body: { name: "foo" } },
    //           { name: "mumble", body: { name: "mumble" } }
    //         ]
    //       });
    //       expect(service.getComposition("foomumble")).toEqual({
    //         name: "foomumble",
    //         elements: [
    //           { name: "foo", body: { name: "foo" } },
    //           { name: "mumble", body: { name: "mumble" } }
    //         ]
    //       });
    //   });
    // });
  });

  // describe("#getElementByComposition", () => {
  //   var fooElement = { name: "foo" };
  //   var barElement = { name: "bar" };
  //   var mumbleElement = { name: "mumble"};

  //   service.setElement(fooElement);
  //   service.setElement(barElement);
  //   service.setElement(mumbleElement);

  //   var composition = {
  //     name: "foobar",
  //     elements: [ fooElement, barElement ]
  //   };

  //   it("should find a registed element in a register composition", () => {
  //     service.getElementByComposition("foobar.missing").toEqual(
  //       { name: "foo", body: { name: "foo" } }
  //     );
  //   });
  //   it("should fail when the element is unregistered", () => {
  //     service.getElementByComposition("foobar.missing").toEqual(undefined);
  //   });

  //   it("should fail when the composition is unregistered", () => {
  //     service.getElementByComposition("missing.foo").toEqual(undefined);
  //   });

  //   it("should fail if the element is not in the composition", () => {
  //     service.getElementByComposition("foobar.mumble").toEqual(undefined);
  //   });
  // });
});