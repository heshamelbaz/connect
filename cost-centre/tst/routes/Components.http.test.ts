import * as chai from "chai";
import "mocha";
import {App} from "../../src/App";
import chaiHttp = require("chai-http");
import {IComponent} from "../../src/models/Component";

chai.use(chaiHttp);
const expect = chai.expect;

describe("test components routes", () => {
    const app = new App(3000).getExpressApplication();

    const testData: IComponent = {
        name: "test",
        description: "description",
    };

    before("setup/test create", () => {
        // Create test element
        return chai.request(app).post("/components")
            .send(testData)
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.true;
            });
    });

    it("/ scans all components", () => {
        return chai.request(app).get("/components")
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal([testData]);
            });
    });

    it("/:name get component", () => {
        return chai.request(app).get("/components/" + testData.name)
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal(testData);
            });
    });

    it("/:name update component", () => {
        return chai.request(app).put("/components/" + testData.name)
            .send({
                description: "new description",
            })
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.not.deep.equal(testData);
                expect(response.body.name).to.equal(testData.name);
                expect(response.body.description).to.equal("new description");
            });
    });

    after("cleanup/test delete", () => {
        // Delete test data
        return chai.request(app).del("/components/" + testData.name)
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.true;
            });
    });
});
