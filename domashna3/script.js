function Vozac(ime, tim, brzina, vestina, gumi) {
    this.ime = ime;
    this.tim = tim;
    this.brzina = brzina;
    this.vestina = vestina;
    this.gumi = gumi;

    this.pitShansa = 0.1;
    this.bilVoPit = false;
    this.brojPitStopovi = 0;
    this.vremeZagubeno = 0;
    this.vkupnoVreme = 0;
    this.vremeOvojKrug = 0;
    this.pitOvojKrug = "";
    this.spinOvojKrug = false;
}

function proveriPit(vozac) {
    if (!vozac.bilVoPit && vozac.pitShansa >= 1) {
        return true;
    }

    if (Math.random() < vozac.pitShansa) {
        return true;
    }

    if (!vozac.bilVoPit) {
        vozac.pitShansa += 0.13;
    }

    return false;
}

function odiVoPit(vozac) {
    var stariGumi = vozac.gumi;

    vozac.bilVoPit = true;
    vozac.brojPitStopovi++;
    vozac.pitShansa = 0.1;

    if (vozac.gumi === "soft") {
        vozac.gumi = "hard";
    } else {
        vozac.gumi = "soft";
    }

    vozac.pitOvojKrug = stariGumi + " -> " + vozac.gumi;
}

function proveriSpin(vozac) {
    vozac.spinOvojKrug = false;
    vozac.vremeZagubeno = 0;

    if (Math.random() < 0.03) {
        vozac.vremeZagubeno = 3 + Math.random() * 7;
        vozac.spinOvojKrug = true;
    }

    return vozac.spinOvojKrug;
}

function proveriSafetyCar() {
    return Math.random() < 0.1;
}

function presmetajVreme(vozac) {
    var brzinaNorm = (vozac.brzina - 200) / 50;
    var sposobnost = vozac.vestina;

    var shansa = (brzinaNorm + sposobnost) / 2;
    var vreme = 100 - shansa * 20;

    vreme += Math.random() * 6 - 3;

    if (vozac.gumi === "soft") {
        vreme *= 0.99;
    } else {
        vreme *= 1.02;
    }

    return vreme;
}

var vozachi = [
    new Vozac("Verstappen", "Red Bull", 248, 0.91, "soft"),
    new Vozac("Hamilton", "Ferrari", 240, 0.98, "soft"),
    new Vozac("Leclerc", "Ferrari", 249, 0.86, "soft"),
    new Vozac("Norris", "McLaren", 247, 0.88, "soft"),
    new Vozac("Piastri", "McLaren", 246, 0.84, "soft"),
    new Vozac("Russell", "Mercedes", 245, 0.85, "soft"),
    new Vozac("Alonso", "Aston Martin", 235, 0.99, "soft"),
    new Vozac("Sainz", "Williams", 241, 0.89, "soft"),
    new Vozac("Gasly", "Alpine", 237, 0.83, "soft"),
    new Vozac("Hulkenberg", "Sauber", 236, 0.90, "soft")
];

var brojKrugovi = 10;

function prikaziRezultati(krug, safetyCar) {
    var rangirani = [];

    for (var i = 0; i < vozachi.length; i++) {
        rangirani[i] = vozachi[i];
    }
    rangirani.sort(function(a, b) {
        return a.vkupnoVreme - b.vkupnoVreme;
    });

    var najdobroVreme = rangirani[0].vkupnoVreme;

    var html = "<h2>Krug " + krug + " / " +
        brojKrugovi + "</h2>";

    if (safetyCar) {
        html += "<p><strong>SAFETY CAR NA PATEKATA!</strong></p>";
    }

    html += "<table border='1' cellpadding='8'>";
    html += "<tr>";
    html += "<th>Pozicija</th>";
    html += "<th>Ime</th>";
    html += "<th>Tim</th>";
    html += "<th>Vreme za ovoj krug</th>";
    html += "<th>Vkupno vreme</th>";
    html += "<th>Zaostanuvanje</th>";
    html += "<th>Pit stopovi</th>";
    html += "<th>Pit stop ovoj krug</th>";
    html += "<th>Spin</th>";
    html += "<th>Gumi</th>";
    html += "</tr>";

    for (var i = 0; i < rangirani.length; i++) {
        var v = rangirani[i];
        var zaostanuvanje = v.vkupnoVreme - najdobroVreme;

        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + v.ime + "</td>";
        html += "<td>" + v.tim + "</td>";
        html += "<td>" + v.vremeOvojKrug.toFixed(2) + " s</td>";
        html += "<td>" + v.vkupnoVreme.toFixed(2) + " s</td>";

        if (i === 0) {
            html += "<td>Vodi</td>";
        } else {
            html += "<td>+" + zaostanuvanje.toFixed(2) + " s</td>";
        }

        html += "<td>" + v.brojPitStopovi + "</td>";
        html += "<td>" + v.pitOvojKrug + "</td>";
        html += "<td>" + (v.spinOvojKrug ? "SPIN!" : "") + "</td>";
        html += "<td>" + v.gumi + "</td>";
        html += "</tr>";
    }

    html += "</table><br>";

    document.getElementById("rezultati").innerHTML += html;
}

function startTrka() {
    document.getElementById("rezultati").innerHTML = "";

    for (var i = 0; i < vozachi.length; i++) {
        vozachi[i].vkupnoVreme = 0;
        vozachi[i].vremeOvojKrug = 0;
        vozachi[i].pitShansa = 0.1;
        vozachi[i].bilVoPit = false;
        vozachi[i].brojPitStopovi = 0;
        vozachi[i].vremeZagubeno = 0;
        vozachi[i].gumi = "soft";
        vozachi[i].pitOvojKrug = "";
        vozachi[i].spinOvojKrug = false;
    }

    for (var krug = 1; krug <= brojKrugovi; krug++) {
        var safetyCar = proveriSafetyCar();

        for (var i = 0; i < vozachi.length; i++) {
            var vozac = vozachi[i];

            vozac.pitOvojKrug = "";
            vozac.spinOvojKrug = false;

            var voPit = false;

            if (proveriPit(vozac)) {
                odiVoPit(vozac);
                voPit = true;
            }

            var vreme = presmetajVreme(vozac);

            if (voPit) {
                vreme += 2;
            }

            proveriSpin(vozac);
            vreme += vozac.vremeZagubeno;

            if (safetyCar) {
                vreme = vreme * 0.3 + 70;
            }

            vozac.vremeOvojKrug = vreme;
            vozac.vkupnoVreme += vreme;
        }

        prikaziRezultati(krug, safetyCar);
    }

    var rangirani = [];

    for (var i = 0; i < vozachi.length; i++) {
        rangirani[i] = vozachi[i];
    }

    rangirani.sort(function(a, b) {
        return a.vkupnoVreme - b.vkupnoVreme;
    });

    var html = "<div class='podium'>";

    html += "<div class='podium-card srebro'>";
    html += "<h2>2nd Place</h2>";
    html += "<h3>" + rangirani[1].ime + "</h3>";
    html += "<p>" + rangirani[1].tim + "</p>";
    html += "<p>" + rangirani[1].vkupnoVreme.toFixed(2) + " s</p>";
    html += "</div>";

    html += "<div class='podium-card zlato'>";
    html += "<h2>WINNER</h2>";
    html += "<h3>" + rangirani[0].ime + "</h3>";
    html += "<p>" + rangirani[0].tim + "</p>";
    html += "<p>" + rangirani[0].vkupnoVreme.toFixed(2) + " s</p>";
    html += "</div>";

    html += "<div class='podium-card bronza'>";
    html += "<h2>3rd Place</h2>";
    html += "<h3>" + rangirani[2].ime + "</h3>";
    html += "<p>" + rangirani[2].tim + "</p>";
    html += "<p>" + rangirani[2].vkupnoVreme.toFixed(2) + " s</p>";
    html += "</div>";

    html += "</div>";

    document.getElementById("rezultati").innerHTML += html;





}window.onload = function() {
    var html = "<h2>Lista na vozachi</h2>";
    html += "<table border='1' cellpadding='8'>";
    html += "<tr><th>Ime</th><th>Tim</th><th>Brzina</th><th>Vestina</th><th>Gumi</th></tr>";

    for (var i = 0; i < vozachi.length; i++) {
        html += "<tr>";
        html += "<td>" + vozachi[i].ime + "</td>";
        html += "<td>" + vozachi[i].tim + "</td>";
        html += "<td>" + vozachi[i].brzina + "</td>";
        html += "<td>" + vozachi[i].vestina.toFixed(2)*100 + "</td>";
        html += "<td>" + vozachi[i].gumi + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("listaVozachi").innerHTML = html;
};