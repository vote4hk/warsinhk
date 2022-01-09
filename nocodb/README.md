# NocoDB

## Development

```shell

# setup env vars
cp .env-sample .env

# Run MySQL and NocoDB with docker-compose
docker-compose up
```

### Wipe database

To stop the container and start everything again from scratch, run the following command.
This will 1) remove the docker container and 2) remove the volume -> i.e. wipe the database

```shell
./script/wipe.sh
```


### Prepare Excel to import

To create a project with all schema setup, you will need an excel file that contains all the data as different sheets.

```shell
./script/prepare_excel.js
```

🚨 
When importing the project from an excel, 
replace the enum `citizenship_en` with 
```
'Wuhan','Ma On Shan','North Point','Shenzhen','Yau Ma Tei','Tsing Yi','Hung Hom','Kwai Chung','Ho Man Tin','Lam Tin','To Kwa Wan','Sai Wan Ho','Sha Tin','Sheung Shui','Fo Tan','Wan Chai','Ngau Chi Wan','Happy Valley','Siu Sai Wan','Ap Lei Chau','Tseung Kwan O','Aberdeen','Tuen Mun','Quarry Bay','Shek O','Sheung Wan','Tsz Wan Shan','Ngau Tau Kok','Kwun Tong','Yuen Long','Yau Tong','Tin Hau','Uncertain','Chai Wan','Stanley','Tai Hang','Cheung Sha Wan','Mid-levels','Pok Fu Lam','Shek Tong Tsui','Tai Po','Sham Tseng','Kowloon Bay','Kennedy Town','Clear Water Bay','Fanling','Sai Kung','The Peak','Tsim Sha Tsui','Tai Wai','Ma Tau Wai','Diamond Hill','Admiralty','Tai Kok Tsui','Outside HK','Sham Shui Po','Kowloon Tong','Repulse Bay','Tung Chung','Sai Ying Pun','Tsuen Wan','San Po Kong','Tin Shui Wai','Central','Mei Foo','Wong Tai Sin','Lantau Island','Hong Kong','Wong Chuk Hang','Causeway Bay','Shau Kei Wan','#N/A','Mong Kok','Braemar Hill','Lok Ma Chau','Sau Mau Ping','Jardine''s Lookout','Jordan','Heng Fa Chuen','Kam Tin','Sha Tau Kok','Peng Chau','Kai Tak','Shek Kip Mei','Chek Lap Kok','Kowloon City','Lai Chi Kok','Tsing Lung Tau','Ta Kwu Ling','Ma Wan','Hung Shui Kiu','Lei Muk Shue','Lok Fu','Ma Tau Kok','Pat Heung','Lamma Island','Prince Edward','Ma Liu Shui','Cheung Chau','Kwu Tung','Sai Kung North','Kau To Shan','Ting Kau','Fortress Hill'
```

as nocoDB does not escape the enum properly so we will need to handle it on our own. 

