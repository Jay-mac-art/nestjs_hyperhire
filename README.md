# Blockchain Nest.js_241007

```markdown
Blockchain price tracker
```

# Requirement

- Nest.js
- Use Moralis or Solscan API
- Relational Database System
- Swagger
- Clean code
- Dockerize to runnable on my local computer.
    - Should be run all the program by one “docker compose up (—build)” command
    

# Feature

1. Automatically save the Price of **Ethereum and Polygon every 5 minutes**
2. Automatically send an email to “hyperhire_assignment@hyperhire.in” if the price of a chain increases by more than 3% compared to its price one hour ago
3. API - returning the prices of each hour (within 24hours)
4. API  - setting alert for specific price.(parameters are chain, dollar, email)

```markdown
EXAMPLE
1. User can set alert 1000 dollar for ethereum
2. If ethereum goes 1000 dollar it send email.
```

1. API - get swap rate (eth to btc)
    1. input is ethereum amount
    2. return values are
        1. how much btc can get
        2. total fee (eth, dollar)(fee percentage is 0.03)
2. no user authentication required.
