import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';
import config from '../../node-mysql-api/config.json';

const db: any = {};
export default db;

initialize();

async function initialize() {
    const host     = process.env.DB_HOST || process.env.MYSQLHOST || config.database.host;
    const port     = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || String(config.database.port));
    const user     = process.env.DB_USER || process.env.MYSQLUSER || config.database.user;
    const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || config.database.password;
    const database = process.env.DB_NAME || process.env.MYSQLDATABASE || config.database.database;

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        },
        logging: false
    });

    await sequelize.authenticate();
    console.log(`✅ Connected to MySQL: ${host}:${port}/${database}`);

    db.Account      = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
    console.log('✅ Accounts table ready');
}
