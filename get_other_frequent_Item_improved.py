import pandas as pd
dfassoc = pd.read_excel('assoc_rules.xlsx')
def other_frequently_bought_item(item):
    d = defaultdict(list)
    count=(dfassoc.loc[dfassoc['antecedents'] == item, 'consequents']).count()
   
    ante=(dfassoc.loc[dfassoc['antecedents'] == item, 'consequents']).tolist()
   
    conf=((dfassoc.loc[dfassoc['antecedents'] == item, 'confidence']*100).round(2)).tolist()
   

    for i in range(count):
        d[ante[i]].append(conf[i])
    d=dict(d)

    avgDict={}
    for ante,conf in d.items():
        avgDict[ante] = round((sum(conf)/ float(len(conf))),2)
    print(avgDict)
other_frequently_bought_item("JUMBO BAG PINK VINTAGE PAISLEY")

