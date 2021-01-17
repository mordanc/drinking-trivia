export const HttpService = {
  fetchToken: () =>
    fetch("https://opentdb.com/api_token.php?command=request").then((res) =>
      res.json()
    ),

  fetchCategories: () =>
    fetch("https://opentdb.com/api_category.php").then((res) => res.json()),

  fetchQuestion: (session_token: string, category?: string) => {
    var url = "https://opentdb.com/api.php?amount=1";

    if (session_token) {
      url += "&token=" + session_token;
    }
    if (category) {
      url += "&category=" + category;
    }

    return fetch(url).then((res) => res.json());
  },
};
