export interface IPost {
    _id: string
    _createdAt: string
    title: string
    author: {
        name: string
        image: string
    },
    description: string
    mainImage: {
        asset: {
            url: string
        }
    },
    slug: {
        current: string
    },
    comments: [IComment]
    body: [object]
}

export interface IComment {
    approved: boolean
    comment: string
    email: string
    name: string
    psot: {
        _ref: string
        _type: string
    },
    createdAt: string
    _id: string
    _ref: string
    _type: string
    _updatedAt: string  
}