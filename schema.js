import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull } from 'graphql';
import Db from './db';
import Sequelize from 'sequelize';

const User = new GraphQLObjectType({
    name: 'User',
    description: 'This is a user',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(user) {
                    return user.id
                }
            },
            firstName: {
                type: GraphQLString,
                resolve(user) {
                    return user.first_name
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(user) {
                    return user.last_name
                }
            },
            username: {
                type: GraphQLString,
                resolve(user) {
                    return user.username
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(user) {
                    return user.getPosts();
                },
                args: {
                limit: {
                    name: 'limit',
                    type: GraphQLInt
                },

                offset: {
                    name: 'offset',
                    type: GraphQLInt
                }
            }
            },
            userLikes: {
                type: new GraphQLList(Like),
                resolve(user) {
                    return user.getLikes();
                },
                args: {
                    limit: {
                        name: 'limit',
                        type: GraphQLInt
                    },

                    offset: {
                        name: 'offset',
                        type: GraphQLInt
                    }
                }
        }    
        }
    }
});

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'This is a post',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(post) {
                    return post.id
                }
            },
            dateCreated: {
                type: GraphQLString,
                resolve(post) {
                    return post.date_created
                }
            },
            lastUpdated: {
                type: GraphQLString,
                resolve(post) {
                    return post.last_updated
                }
            },
            content: {
                type: GraphQLString,
                resolve(post) {
                    return post.content
                }
            },
            imageLink: {
                type: GraphQLString,
                resolve(post) {
                    return post.image_link
                }
            },
            user: {
                type: User,
                resolve(post) {
                    return post.getUser();
                }
            },
            likes: {
                type: new GraphQLList(Like),
                resolve(post) {
                    return post.getLikes();
                }
            },
            comments: {
                type: new GraphQLList(Comment),
                resolve(post) {
                    return post.getComments();
                }
            },
            likesCount: {
                type: GraphQLInt,
                resolve(post) { 
                    return Db.models.like.count({
                        where: {
                            post_id: post.id
                        }
                    });
                }               
            },
            commentsCount: {
                type: GraphQLInt,
                resolve(post) {
                    return Db.models.comment.count({
                        where: {
                            post_id: post.id
                        }
                    });
                }
            }
        }
    }
});

const Comment = new GraphQLObjectType({
    name: 'Comment',
    description: 'This is a comment',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(comment) {
                    return comment.id
                }
            },
            commentText: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.comment_text
                }
            },
            dateCreated: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.date_created
                }
            },
            lastUpdated: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.last_updated
                }
            },
            user: {
                type: User,
                resolve(comment) {
                    return comment.getUser();
                }
            }
        }
    }
});

const Like = new GraphQLObjectType({
    name: 'Like',
    description: 'This is a like',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(like) {
                    return like.id
                }
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'This is a mutation',
    fields: () => {
        return {
            addLike: {
                type: Like,
                args: {
                    userId: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    postId: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                    resolve(root_, args) {
                        return Db.models.like.create({
                            post_id: args.postId,
                            user_id: args.userId
                        });
                    }
            }
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is a root query',
    fields: () => { 
        return {
            user: {
                type: new GraphQLList(User),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    username: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return Db.models.user.findAll({ where: args });
                }
            },
            post: {
                type: new GraphQLList(Post),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    title: {
                        type: GraphQLString
                    },
                    content: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return Db.models.post.findAll({ where: args });
                }
            },
            comment: {
                type: new GraphQLList(Comment),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    comment_text: {
                        type: GraphQLString
                    },
                    post_id: {
                        type: GraphQLInt
                    }
                },
                resolve(root, args) {
                    return Db.models.comment.findAll({ where: args });
                }
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default Schema;