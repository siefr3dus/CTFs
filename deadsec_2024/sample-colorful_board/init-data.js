const conn = new Mongo();
const db = conn.getDB('cb');

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomDelay = () => {
    return Math.random() * 3000 + 2000; // 2000ms ~ 5000ms (2sec ~ 5sec)
}

const init_db = async () => {
    await db.users.insertMany([
        { username: "DEAD{THIS_IS_", password: "dummy", personalColor: "#000000", isAdmin: true },
    ]);

    await delay(randomDelay());
    await db.notices.insertOne({ title: "asdf", content: "asdf" });

    await delay(randomDelay());
    await db.notices.insertOne({ title: "flag", content: "FAKE_FLAG}" });

    await delay(randomDelay());
    await db.notices.insertOne({ title: "qwer", content: "qwer" });
}

init_db();
