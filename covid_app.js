// const covid_app = require("./covid.json");
// console.log(covid_app);
//var expressValidator = require('express-validator')//no n inserito
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

var port = "3001";
app.listen(port, () => console.log("\n->\t listening port: 3000 \n"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//token
const passToken = ["pippo"];
var tokens = ({ query }, res, next) => {
    if (passToken.find((item) => item === query.token)) {
        next();
    } else {
        res.status(401).json("Token is not valid");
    }
};

//lista json
var covid = [{
        region: "Sicilia",
        num_population: "5.000000",
        total_num_positive: "104.435",
        num_healed: "62.737",
        num_death: "2.665",
    },
    {
        id: 1,
        region: "Calabria",
        num_population: "1.947000",
        total_num_positive: "28.108",
        num_healed: "16.680",
        num_death: "511",
    },
    {
        id: 2,
        region: "Basilicata",
        num_population: "562.869",
        total_num_positive: "11.533",
        num_healed: "4.868",
        num_death: "270",
    },
    {
        id: 3,
        region: "Campania",
        num_population: "5.802000",
        total_num_positive: "197.052",
        num_healed: "117.997",
        num_death: "3.072",
    },
    {
        id: 4,
        region: "Molise",
        num_population: "305.617",
        total_num_positive: "6.932",
        num_healed: "5.125",
        num_death: "208",
    },
    {
        id: 5,
        region: "Lazio",
        num_population: "5.879000",
        total_num_positive: "176.779",
        num_healed: "94.400",
        num_death: "4.058",
    },
    {
        id: 6,
        region: "Abruzzo",
        num_population: "1.312000",
        total_num_positive: "37.109",
        num_healed: "24.513",
        num_death: "1.276",
    },
    {
        id: 7,
        region: "Umbria",
        num_population: "882.015",
        total_num_positive: "30.203",
        num_healed: "25.506",
        num_death: "649",
    },
    {
        id: 8,
        region: "Marche",
        num_population: "1.525000",
        total_num_positive: "45.222",
        num_healed: "29.681",
        num_death: "1.675",
    },
    {
        id: 9,
        region: "Sardegna",
        num_population: "1.64000",
        total_num_positive: "",
        num_healed: "",
        num_death: "",
    },
    {
        id: 10,
        region: "Emiglia-Romagna",
        num_population: "4.459000",
        total_num_positive: "187.228",
        num_healed: "123.348",
        num_death: "8.174",
    },
    {
        id: 11,
        region: "Toscana",
        num_population: "3.730000",
        total_num_positive: "123.667",
        num_healed: "110.598",
        num_death: "3.825",
    },
    {
        id: 12,
        region: "Veneto",
        num_population: "4.906000",
        total_num_positive: "280.596",
        num_healed: "180.676",
        num_death: "7.200",
    },
    {
        id: 13,
        region: "Liguria",
        num_population: "1.551000",
        total_num_positive: "62.670",
        num_healed: "54.513",
        num_death: "2.979",
    },
    {
        id: 14,
        region: "Friuli-Venezia-Giulia",
        num_population: "1.215000",
        total_num_positive: "55.000",
        num_healed: "40.247",
        num_death: "1.863",
    },
    {
        id: 15,
        region: "Piemonte",
        num_population: "4.356000",
        total_num_positive: "205.004",
        num_healed: "179.702",
        num_death: "8.124",
    },
    {
        id: 16,
        region: "Trentino-Alto-Adige",
        num_population: "1.027000",
        total_num_positive: "",
        num_healed: "",
        num_death: "",
    },
    {
        id: 17,
        region: "Valle-d'Osta ",
        num_population: "125.666",
        total_num_positive: "7.472",
        num_healed: "6.623",
        num_death: "388",
    },
    {
        id: 18,
        region: "Lombardia",
        num_population: "10.000600",
        total_num_positive: "495.799",
        num_healed: "414.214",
        num_death: "25.565",
    },
];

var data = [];
app.all("*", tokens);

//leggere tutti dati
app.get("/data/", (req, res) => {
    console.log("1: whole list data processing");
    if (covid.length > 0) res.status(200).json(covid);
    else res.status(404).json({ message: "data not found" });
});

//filtrare regione per indice
app.get("/data/covid/:index", (req, res) => {
    console.log("2: extraction of region data  by index");
    if (req) res.status(200).json(covid[req.params.index]);
    else res.status(404).json({ message: "specified data not found" });
});

//filtare le regioni con dati incomplete

app.get("/incompleteRegData/covid/", (req, res) => {
    console.log("3: filter regions with incomplete data parameters");
    const filtered = covid.filter(
        (region) =>
        region.total_num_positive === "" ||
        region.num_healed === "" ||
        region.num_death === ""
    );
    if (filtered.length !== 0) res.json(filtered);
    else
        res.status(404).json({
            error: "data not found",
        });
});

//cercare una regione per nome
var data = [];
app.get("/data/covid/", (req, res) => {
    console.log("4: extraction data per region name");

    /* //ha lòa stessa funzionalità di questo di sotto
                              const { region } = query
                              const extracted = covid.find(({ region: region1 }) => region1 === req.query.region);
                              if (extracted)
                                  res.status(200).json(extracted);
                            el  se
                                  res.status(404).json({ message: 'region name not found' });
                            */

    if (typeof req.query.region !== "undefined") {
        var region = req.query.region;

        for (var i = 0; i < covid.length; i++) {
            if (covid[i].region === region) {
                data.push(covid[i]);
            }
        }
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: " - region name not found" });
        }
    } else if (
        typeof req.query.id === "undefined" &&
        typeof req.query.region === "undefined" &&
        typeof req.query.total_num_positive !== "undefined" &&
        typeof req.query.num_population !== "undefined" &&
        typeof req.query.num_healed !== "undefined" &&
        typeof req.query.num_death !== "undefined"
    ) {
        var id = req.query.id;
        for (var i = 0; i < covid.length; i++) {
            if (
                covid[i].id === id ||
                covid[i].num_population === num_population ||
                covid[i].total_num_positive === total_num_positive ||
                covid[i].num_healed === num_healed ||
                covid[i].num_death === num_death
            ) {
                data.push(covid[i]);
            }
        }
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: " - specified region data not found" });
        }
    } else {
        res.json(covid);
    }
    //*/
});

//creare o aggiungere una nuova regione
app.post("/data/covid/", ({ body }, res) => {
    console.log("5: adding new data");
    var {
        id,
        region,
        num_population,
        total_num_positive,
        num_healed,
        num_death,
    } = body;

    if (!id) return res.status(404).json({ message: "id is required" });
    if (!region) return res.status(404).json({ message: "region is required" });
    if (!num_population)
        return res.status(404).json({ message: "num_population is required" });
    if (!total_num_positive)
        return res
            .status(404)
            .json({ message: "total number of positives is required" });
    if (!num_healed)
        return res.status(404).json({ message: "number of healed is required" });
    if (!num_death)
        return res.status(404).json({ message: "number of death is required" });

    var newReg = {
        id,
        region,
        num_population,
        total_num_positive,
        num_healed,
        num_death,
    };
    covid.push(newReg);
    res.status(201).json(newReg);
    /*
      var newReg = {
        id: req.body.id,
        region: req.body.region,
        num_population: req.body.num_population,
        total_num_positive: req.body.total_num_positive,
        num_healed: req.body.num_healed,
        num_death: req.body.num_death

    }
    covid.push(newReg);
    if (newReg.length !== 0)
        res.status(201).json(newReg);
    else
        res.status(404).json({ message: 'no new region has been added' })
*/
});

//aggiornare dati di una regione
app.put("/data/covid/:index", (req, res) => {
    console.log("6: modification of region's data ");
    covid[req.params.index].id = req.body.id;
    covid[req.params.index].region = req.body.region;
    covid[req.params.index].num_population = req.body.num_population;
    covid[req.params.index].total_num_positive = req.body.total_num_positive;
    covid[req.params.index].num_healed = req.body.num_healed;
    covid[req.params.index].num_death = req.body.num_death;
    console.log(
        " - the region of",
        req.body.region,
        "'s data has been updated as requested "
    );
    res.status(200).json(covid);
});

//eliminare una regione
// app.delete("/data/covid/", (req, res) => {
//     console.log("7: elimination of the specified region ");
//     var region = req.query.region;
//     if (covid.map((el) => el.region).indexOf(region) != -1) {
//         for (var i = 0; i < covid.length; i++) {
//             if (covid[i].region === region) {
//                 covid.splice(i, 1);
//                 console.log(
//                     " - the region of",
//                     region,
//                     "has been eliminated as requested "
//                 );
//             }
//         }
//         res.status(200).json(covid);
//     } else {
//         res.status(404).json({ message: " - specified region name  not found" });
//     }
// });

app.delete("/data/covid/", (req, res) => {
    console.log("7: elimination of the specified region ");
    var region = { query: region };
    if (covid.map((el) => el.region).indexOf(region) == -1)
        res.status(404).json({ error: " - specified region name  not found" });
    covid.find((region) => {
        if (covid[i].region === region) covid.splice(i, 1);
        console.log(
            " - the region of" + region + "has been eliminated as requested "
        );
        res.status(200).json(covid);
    });
});

module.exports.app = app;

exports.resetData = resetData = () => {
    data = [];
};