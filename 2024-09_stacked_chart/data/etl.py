from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("food-emissions-supply-chain.csv"))
df = df.drop(["Code", "Year", "food_emissions_losses"], axis=1)
df.columns = [
    "food",
    "landUse",
    "farm",
    "animalFeed",
    "processing",
    "transport",
    "retail",
    "packaging",
]

df["others"] = df["processing"] + df["transport"] + df["retail"] + df["packaging"]

df = df.drop(["processing", "transport", "retail", "packaging"], axis=1)

print(df.isna().sum())
print(df.head())

df.to_csv(get_path("dataset.csv"), index=False)
