var assert = require("assert");
var chai = require("chai").should();
const request = require("supertest");
const { app, resetData } = require("../covid_app.js");
const passToken = ["pippo"];

describe("->\tcovid-19-Italia\n", function() {
    it("read all regions ", async() => {
        const { status, body } = await request(app)
            .get("/data/?token=pippo")
            .set("Accept", "application/json");
        status.should.equal(200);
        body.should.not.have.property("message");
    });

    it("read by index ", async() => {
        const { status, body } = await request(app)
            .get("/data/covid/:index/?token=pippo")
            .set("Accept", "application/json");
        status.should.equal(200);
        body.should.have.property("length");
    });
    it("read the incompleteReg data", async() => {
        const { status, body } = await request(app)
            .get("/incompleteRegData/covid/?token=pippo")
            .set("Accept", "application/json");
        status.should.equal(200);
        body.should.not.have.property("error");
    });

    it("read region", async() => {
        const { status, body: extracted } = await request(app)
            .get("/data/covid/?token=pippo")
            .set("Accept", "application/json");
        status.should.equal(200);
        extracted.should.not.have.property("message");
    });
});

describe("adding new region", () => {
    const newReg = {
        id: 19,
        region: "unknown ",
        num_population: "1.64000 ",
        total_num_positive: "1.000 ",
        num_healed: "300 ",
        num_death: "20 ",
    };

    it("new region added", async() => {
        const { status } = await request(app)
            .post("/data/covid/?token=pippo")
            .set("Accept", "application/json")
            .send(newReg);
        status.should.equal(201);
    });
});

describe("update data", () => {
    it("update success", async() => {
        const { status } = await request(app)
            .put("/data/covid/9/?token=pippo")
            .set("Accept", "application/json")
            .send({
                id: 9,
                region: "Sardegna",
                num_population: "1.64000 ",
                total_num_positive: "6.000 ",
                num_healed: "5.000 ",
                num_death: "700 ",
            });
        status.should.equal(200);
    });
});

describe("Elimination of data", () => {
    it("...delete success", async(_, res) => {
        const { status, query } = await request(app)
            .delete("/data/covid/?region=region&token=pippo")
            .set("Accept", "application/json");
        res.status.should.equal(200);
        query.should.not.have.property("error");

    });
    it("if not corrisponds", async(_, res) => {
        const { status, querry } = await resquest(app).delete(
            "/data/covid/?region=region&token=Pippo"
        );
        res.status.should.equal(404);
        query.should.have.property("error");
    });
});