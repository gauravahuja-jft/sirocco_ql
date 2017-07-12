import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const Conn = new Sequelize(
    'sirocco',
    'root',
    'password',
    {
        dialect: 'mysql',
        host: 'localhost'
    });

const Comment = Conn.define(
    'comment', {
        comment_text: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        updatedAt: 'last_updated',
        createdAt: 'date_created',
        underscored: true
    }
);

const Post = Conn.define(
    'post', {
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image_link: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        updatedAt: 'last_updated',
        createdAt: 'date_created',
    }
);

const User = Conn.define(
    'user', {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        underscored: true,
        timestamps: false
    }
);

const Like = Conn.define(
    'like', {
        user_id: {
            type: User,
            allowNull: false
        }
    },
    {
        tableName: 'user_like',
        underscored: true,
        timestamps: false
    }
);

//Relationships
Post.hasMany(Like);
Post.hasMany(Comment);
Post.belongsTo(User);
Comment.belongsTo(User);
Comment.belongsTo(Post);

User.hasMany(Post);
User.hasMany(Comment);

Like.belongsTo(Post);
Like.belongsTo(User);
/*
Conn.sync({ force: true }).then(() => {
    _.times(10, () => {
        Person.create({
            firstName: Faker.name.firstName(),
            lastName: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then(person => {
            person.createPost({
                title: Faker.lorem.sentence(),
                content: Faker.lorem.paragraph(),
            })
        });
    });

});
*/
export default Conn;
