const articleMock = {
  '987654': {
    articleTitle: 'Lorem ipsum - article one',
    articleContent: 'Here goes the content of the article'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '1234256': {
    articleTitle: 'Lorem ipsum - article tw23o',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  },
  '123456': {
    articleTitle: 'Lorem ipsum - article two',
    articleContent: 'Sky is the limit, the content goes here.'
  }
}

const article =(state=articleMock,action)=>{
  switch (action.type) {
    case 'RETURN_ALL_ARTICLES':
      return Object.assign({},state)

      break
    default:
    return state

  }
}

export default article
