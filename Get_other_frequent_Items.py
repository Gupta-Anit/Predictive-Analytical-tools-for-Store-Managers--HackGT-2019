#!/usr/bin/env python
# coding: utf-8

# In[103]:


import pandas as pd
df = pd.read_excel('Online Retail.xlsx')

df['Description'] = df['Description'].str.strip()
df.dropna(axis=0, subset=['InvoiceNo'], inplace=True)
df['InvoiceNo'] = df['InvoiceNo'].astype('str')
df = df[~df['InvoiceNo'].str.contains('C')]

basket = (df[df['Country'] =="United Kingdom"]
          .groupby(['InvoiceNo', 'Description'])['Quantity']
          .sum().unstack().reset_index().fillna(0)
          .set_index('InvoiceNo'))

def encode_units(x):
    if x <= 0:
        return 0
    if x >= 1:
        return 1

basket_sets = basket.applymap(encode_units)
basket_sets.drop('POSTAGE', inplace=True, axis=1)
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules

frequent_itemsets = apriori(basket_sets, min_support=0.015, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)
rules["antecedents"] = rules["antecedents"].apply(lambda x: list(x)[0]).astype("unicode")
rules["consequents"] = rules["consequents"].apply(lambda x: list(x)[0]).astype("unicode")


# In[124]:


def other_frequently_bought_item(item):
    print(rules.loc[rules['antecedents'] == item, 'consequents'].iloc[0])
    print((rules.loc[rules['antecedents'] == item, 'confidence'].iloc[0]*100).round(2))

other_frequently_bought_item("JUMBO BAG PINK VINTAGE PAISLEY")
   


# In[ ]:




