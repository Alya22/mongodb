// Parser Shazam
const { Builder, By, Key, util } = require('selenium-webdriver');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Alexandra:1111@cluster0-tacw8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
async function pars() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://www.shazam.com/ru/charts/top-200/ukraine');
        let date = new Date().toString();
        let tracks = {};
        tracks[date] = {};
        driver.sleep(15000).then(async function() {
            for (let i = 1; i < 51; i++) {
                let name = await driver.findElement(By.xpath('//*[@id="/charts/top-200/ukraine"]/div[3]/div[1]/div/ul/li[' + i + ']/article/div/div[2]/div/div[1]/a')).getText();
                let link = await driver.findElement(By.xpath('//*[@id="/charts/top-200/ukraine"]/div[3]/div[1]/div/ul/li[' + i + ']/article/div/div[2]/div/div[1]/a')).getAttribute('href');
                tracks[date][i] = {
                    title: name,
                    link: link
                }
            }
            driver.quit();
            client.connect(err => {
                const collection = client.db("web").collection("Web");

                collection.insertOne(tracks, function(err, result) {

                    if (err) {
                        return console.log(err);
                    }
                    console.log(result.ops);
                    client.close();
                });
            });
        });
    } catch {
        console.log('Ошибка...');
        driver.quit();
    }
}
pars();