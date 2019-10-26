#!/usr/bin/env python
# coding: utf-8

# In[ ]:


dfassoc = pd.read_excel('assoc_rules.xlsx')
def other_frequently_bought_item(item):
    print(dfassoc.loc[rules['antecedents'] == item, 'consequents'].iloc[0])
    print((dfassoc.loc[rules['antecedents'] == item, 'confidence'].iloc[0]*100).round(2))

other_frequently_bought_item("JUMBO BAG PINK VINTAGE PAISLEY")

