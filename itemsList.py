import pandas as pd

dfassoc = pd.read_excel('assoc_rules.xlsx')

dataArray = dfassoc['antecedents'].unique().tolist()

returnData = []
for i in range(50):
    returnData.append(dataArray[i])

# print (len(dataArray))

result = {
    "items" : returnData
}

print(result)