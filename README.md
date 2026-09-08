# leetcodeapp.com

Static site for the [Leetcode Explained](https://github.com/zubyj/leetcode-explained) browser extension. Plain HTML and CSS, no build step.

- `index.html`: landing page
- `privacy.html`: privacy policy linked from the Chrome Web Store listing
- `problems-by-company/`: browsable company problem lists, reads `assets/data/problems_by_company.json` (copied from the extension repo) and `assets/data/difficulty.json`

To refresh the data after updating the extension's datasets:

```
cp ../leetcode-explained/src/assets/data/problems_by_company.json assets/data/
python3 -c "import json; d=json.load(open('../leetcode-explained/src/assets/data/problem_data.json'))['questions']; json.dump({q['frontend_id']:q['difficulty_lvl'] for q in d if q.get('difficulty_lvl')}, open('assets/data/difficulty.json','w'), separators=(',',':'))"
```

Deploy by copying the repo contents to the nginx document root on the server.
