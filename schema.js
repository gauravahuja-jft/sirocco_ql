import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import Db from './db';

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
            first_name: {
                type: GraphQLString,
                resolve(user) {
                    return user.first_name
                }
            },
            last_name: {
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
            date_created: {
                type: GraphQLString,
                resolve(post) {
                    return post.date_created
                }
            },
            last_updated: {
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
            image_link: {
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
            comment_text: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.comment_text
                }
            },
            date_created: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.date_created
                }
            },
            last_updated: {
                type: GraphQLString,
                resolve(comment) {
                    return comment.last_updated
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

const Query = new GraphQLObjectType({
    name: 'Query',
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
    query: Query
});

export default Schema;