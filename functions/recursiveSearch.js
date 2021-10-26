// Recursively traverse array of objects with unknown depth
// Sort by "ups"
// If object at index has comments, recurse

export const recursiveSearch = (comments) => {
    comments.sort((a, b) => {
        let keyA = a.ups
        let keyB = b.ups

        if (keyA < keyB) return 1
        if (keyA > keyB) return -1
        return 0
    })

    for (let i = 0; i < comments.length; i++) {
        if (comments[i].replies) {
            comments[i].replies.sort((a, b) => {
                let keyA = a.ups
                let keyB = b.ups

                if (keyA < keyB) return 1
                if (keyA > keyB) return -1
                return 0
            })

            if (comments[i].ups > 50) return comments[i]
            // return comments[i]
        }
        
        let search = recursiveSearch(comments[i])
        if (search) return search
    } return null
}