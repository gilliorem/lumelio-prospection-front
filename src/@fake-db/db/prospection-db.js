const { default: mock } = require("@fake-db/mock");

let streetsData = [
  {
    name: "Rue de la Madeleine",
    postcode: "59800",
    city: "Lille",
    numbers: [
      {
        housenumber: "2",
        complement: null,
        status: 3,
      },
      {
        housenumber: "3",
        complement: null,
        status: 2,
      },
      {
        housenumber: "4",
        complement: null,
        status: 4,
      },
      {
        housenumber: "5",
        complement: null,
        status: 3,
      },
      {
        housenumber: "6",
        complement: null,
        status: 2,
      },
      {
        housenumber: "7",
        complement: null,
        status: 5,
      },
      {
        housenumber: "8",
        complement: null,
        status: 5,
      },
    ],
  },
];

mock.onPost("/api/prospection/street").reply((request) => {
  const data = JSON.parse(request.data);
  const { city, postcode, name } = data;
  let response = [];
  response = streetsData.filter(
    (e) => e.postcode === postcode && e.name === name && e.city === city
  );
  return [200, response[0]];
});

mock.onPost("/api/prospection/setNumber").reply((request) => {
  const data = JSON.parse(request.data);
  const { city, postcode, name, housenumber, status } = data;

  const streetExists = streetsData.filter(
    (e) => e.city === city && e.postcode === postcode && e.name === name
  )[0];

  if (streetExists) {
    streetsData = streetsData.map((e) => {
      if (e.city === city && e.postcode === postcode && e.name === name) {
        if (e.numbers.filter((f) => f.houseNnmber === housenumber).length > 0) {
          e.numbers.map((j) => {
            if (j.housenumber === housenumber) {
              j.status = status;
            }
            return j;
          });
        } else {
          e.numbers = [...e.numbers, { housenumber, status }];
        }
      }
      return e;
    });
  } else {
    streetsData = [
      ...streetsData,
      { name, city, postcode, numbers: [{ housenumber, status }] },
    ];
  }
  return [200, data];
});
