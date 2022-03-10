'use strict';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('clickedElement:', clickedElement);

  /* removed class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* added class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* removed class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  console.log('Articles list:', activeArticles);

  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* got 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* found the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);  

  /* added class 'active' to the correct article */
  targetArticle.classList.add('active');
}

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}