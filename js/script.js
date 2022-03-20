{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
  };

  const opts = {
    ArticleSelector: '.post',
    TitleSelector: '.post-title',
    TitleListSelector: '.titles',
    ArticleTagsSelector: '.post-tags .list',
    ArticleAuthorSelector: '.post-author',
    TagsListSelector: '.tags.list',
    AuthorsListSelector: '.authors',
    CloudClassCount: 6,
    CloudClassPrefix: 'tag-size-'
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* removed class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* added class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* removed class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* got 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* found the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* added class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const generateTitleLinks = function (customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(opts.TitleListSelector);
    const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);

    let html = '';

    /* for each article */
    for (let article of articles) {

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */ /* get the title from the title element */
      const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      html = html + linkHTML;
    }

    /* insert link into titleList */
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }

  };

  generateTitleLinks();

  const calculateParams = function (tags) {

    const values = Object.values(tags);

    const max = Math.max(...values);
    const min = Math.min(...values);
    const paramObj = {
      min: `${min}`,
      max: `${max}`
    };
    return paramObj;

  };

  const calculateCloudClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.CloudClassCount - 1) + 1);

    return opts.CloudClassPrefix + classNumber;
  };


  const generateTags = function () {

    /* [NEW] create a new variable allTags with an empty array */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opts.ArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

      /* find tags wrapper */
      const tagWrapper = article.querySelector(opts.ArticleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */ /* split tags into array */
      const articleTagsArray = article.getAttribute('data-tags').split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {

        /* generate HTML of the link */
        const linkHTMLData = { id: tag, title: tag };
        const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {

          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        /* insert HTML of all the links into the tags wrapper */
        tagWrapper.innerHTML = html;

        /* END LOOP: for every article: */
      }

      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector(opts.TagsListSelector);

      /* [NEW] create variable for all links HTML code */
      const tagsParams = calculateParams(allTags);

      const allTagsData = { tags: [] };

      /* [NEW] START LOOP: for each tag in allTags: */
      for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */
        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateCloudClass(allTags[tag], tagsParams)
        });
      }
      /* [NEW] END LOOP: for each tag in allTags: */

      /*[NEW] add HTML from allTagsHTML to tagList */
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
    }
  };

  generateTags();

  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll(`a.active[href^="#tag-"]`);

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');

      /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll(`a[href="${href}"]`);

    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {

      /* add class active */
      tagLink.classList.add('active');

      /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {

      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);

      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function () {
    let allAuthors = {};
    const articles = document.querySelectorAll(opts.ArticleSelector);
    const authorList = document.querySelector(opts.AuthorsListSelector);

    for (let article of articles) {
      const authorWrapper = article.querySelector(opts.ArticleAuthorSelector);
      let html = '';
      const author = article.getAttribute('data-author');
      const linkHTMLData = { id: author, title: author };
      const linkHTML = templates.authorLink(linkHTMLData);
      html = html + linkHTML;
      authorWrapper.innerHTML = html;
      if (!allAuthors[author]) {
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }

    const authorsParams = calculateParams(allAuthors);
    const allAuthorsData = { authors: [] };

    for (let author in allAuthors) {
      const onlyAuthor = author.replace('by', '');
      allAuthorsData.authors.push({
        author: onlyAuthor,
        authorId: author,
        count: allAuthors[author],
        className: calculateCloudClass(allAuthors[author], authorsParams)
      });
    }
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  };

  generateAuthors();


  const authorClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');

    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for (let activeAuthorLink of activeAuthorLinks) {
      activeAuthorLink.classList.remove('active');
    }

    const authorLinks = document.querySelectorAll(`a[href="${href}"]`);

    for (let authorLink of authorLinks) {
      authorLink.classList.add('active');
    }

    generateTitleLinks(`[data-author="${author}"]`);
  };


  const addClickListenersToAuthors = function () {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');

    for (let authorLink of authorLinks) {
      authorLink.addEventListener('click', authorClickHandler);

    }
  };

  addClickListenersToAuthors();



}

