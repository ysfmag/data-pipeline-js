const AWS = require("aws-sdk");
const region = "eu-west-1";
const TABLE_NAME = "example_import_data";
const _ = require("lodash");
const formatedData = require("./formatedData.json");
AWS.config.update({
  region
});

const docClient = new AWS.DynamoDB.DocumentClient();

const writData = (data, cb) => {
  const params = {
    RequestItems: {}
  };
  params.RequestItems[TABLE_NAME] = [];
  data.map(el => {
    if (!_.isEmpty(el)) {
      params.RequestItems[TABLE_NAME].push({
        PutRequest: {
          Item: el
        }
      });
    }
  });

  return docClient.batchWrite(params).promise();
};

const waitSomeTime = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 10);
  });
};

let chunkedData = _.chunk(formatedData, 25);

let i = 0;

(async () => {
  while (i < chunkedData.length) {
    await writData(chunkedData[i]);
    await waitSomeTime();
    i++;
    console.log("data2", i, chunkedData.length);
  }
})();
