# Predictive Analytical Tools for Store Managers (HackGT 2019)

A predictive analytics tool that helps brick-and-mortar store managers decide what to stock together. It mines historical retail transactions with market-basket / association-rule analysis to surface the items most frequently bought together, and exposes those recommendations through a web app with an interactive tree-map visualization.

Built at HackGT 2019.

## Overview

Store managers often need to know which products complement each other so they can plan placement, bundling, and inventory. This project answers the question *"if a customer buys item X, what else are they likely to buy?"* by:

1. Running an Apriori association-rule analysis over a real online-retail transaction dataset.
2. Persisting the resulting rules (antecedent → consequent with confidence) to a spreadsheet.
3. Serving those rules through a Node/Express web app, where a manager selects an item and sees the frequently-bought-together items rendered as a tree map sized and colored by confidence.

## Data

The analysis uses the **Online Retail** dataset (`Online Retail.xlsx`), a transactional dataset of purchases from a UK-based online retailer. Each row is a line item on an invoice (invoice number, stock description, quantity, country, etc.).

Preprocessing in the analysis:
- Trims item descriptions and drops rows without an invoice number.
- Removes cancelled transactions (invoice numbers containing `C`).
- Filters to the `United Kingdom` market.
- Pivots invoices into a one-hot basket matrix (one row per invoice, one column per item), and drops the `POSTAGE` pseudo-item.

The mined rules are written to `assoc_rules.xlsx`, which the web app reads at request time.

## Approach

1. **Basket construction** – Transactions are grouped by invoice and item into a binary basket matrix where each cell indicates whether an item appeared on that invoice.
2. **Frequent itemsets** – `mlxtend`'s `apriori` finds itemsets with `min_support = 0.015`.
3. **Association rules** – `association_rules` derives rules using `lift` (`min_threshold = 1`); antecedents and consequents are flattened to single item names.
4. **Related-items lookup** – For a selected item, the app filters the rules to that antecedent, groups consequents, and returns the average confidence (as a percentage) per related item.
5. **Visualization** – The related items and their confidence scores are rendered as a tree map, where larger / greener tiles indicate higher confidence.

## Architecture

The project has three layers:

- **Python analytics** – Generates association rules from the raw dataset (`Get_other_frequent_Items.*`) and serves per-item lookups (`itemsList.py`, `getRelatedItems.py`) against the precomputed `assoc_rules.xlsx`.
- **Node/Express server** (`index.js`) – Renders the home page and exposes a `/getItem` endpoint. It shells out to the Python scripts via `python-shell`, parses their stdout into JSON, and returns it to the browser.
- **Frontend** (`views/`, `public/`) – An EJS-rendered page with an item dropdown. On selection it calls `/getItem`, then draws an AnyChart/d3-style tree map of the related items (`public/js/custom.js`). A standalone d3 tree-map prototype lives in `treeMap.html`.

Request flow:

```
Online Retail.xlsx
   │  (apriori / association_rules, mlxtend)
   ▼
assoc_rules.xlsx
   │  itemsList.py  ───────────────►  populate item dropdown
   │  getRelatedItems.py <item> ────►  {related item: avg confidence %}
   ▼
index.js (Express + python-shell)
   ▼
home.ejs + custom.js  ──►  interactive tree-map of related items
```

## Repository structure

| Path | Purpose |
| --- | --- |
| `Get_other_frequent_Items.ipynb` | Notebook: end-to-end Apriori / association-rule analysis on the Online Retail data. |
| `Get_other_frequent_Items.py` | Script export of the notebook analysis. |
| `getRelatedItems.py` | CLI lookup: given an item, returns related items with average confidence from `assoc_rules.xlsx`. |
| `get_other_frequent_Item_improved.py` | Refined version of the related-items lookup. |
| `itemsList.py` | Returns the list of items (rule antecedents) used to populate the UI dropdown. |
| `Online Retail.xlsx` | Source transactional dataset. |
| `assoc_rules.xlsx` | Precomputed association rules consumed by the web app. |
| `index.js` | Express server; renders the UI and bridges to the Python scripts. |
| `package.json` / `package-lock.json` | Node app metadata and dependencies. |
| `requirements.txt` | Python dependencies for the analysis. |
| `views/` | EJS templates (`home.ejs`, navbar/footer/scripts partials) and HTML views. |
| `public/` | Static assets: CSS/SASS, JS (`custom.js` tree-map logic), webfonts. |
| `treeMap.html` | Standalone d3 tree-map prototype. |
| `test.html`, `chart_example_from_d3-graph-gallery (1).html` | Visualization scratch / reference pages. |
| `app.yaml` / `python-app.yaml` | Google App Engine (flexible) deployment configs for the Node and Python services. |

## Tech stack

- **Analytics:** Python, pandas, mlxtend (Apriori + association rules)
- **Backend:** Node.js, Express, EJS, python-shell
- **Frontend:** HTML/CSS/SASS, JavaScript, d3.js / AnyChart tree map, Tableau Public embed
- **Data:** Excel (`.xlsx`) via xlrd/pandas
- **Deployment:** Google App Engine (flexible environment)

## Setup & usage

### Prerequisites

- Python 3.7+
- Node.js and npm

### Python analytics

```bash
pip install -r requirements.txt
```

Regenerate the association rules by running the analysis (e.g. open `Get_other_frequent_Items.ipynb` in Jupyter, or run `python Get_other_frequent_Items.py`). The web app reads the precomputed `assoc_rules.xlsx`.

Look up related items directly:

```bash
python getRelatedItems.py "JUMBO BAG PINK VINTAGE PAISLEY"
```

### Web app

```bash
npm install
npm start
```

The server listens on `http://localhost:8080` (or `$PORT`). Open it, pick an item from the dropdown, and click **Frequently Together Bought Items** to see the related-items tree map. The Express endpoints invoke the Python scripts, so Python and its dependencies must be available on the same machine.

## License

Released under the [MIT License](LICENSE).
