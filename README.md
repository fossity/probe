# [FOSSITY PROBE](https://fossity.com)

<div>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/fossity/probe)
![License](https://img.shields.io/badge/license-GPL--2.0-brightgreen)
![test_workflow](https://github.com/fossity/probe/actions/workflows/test.yml/badge.svg?branch=main)

</div>

Fossity's Decentralized Open Source Auditing Platform offers efficient and confidential audits for M&A due diligence and product developers. The innovative decentralized approach provides scalability, reliability, and eliminates human error.


Fossity Probe is a cross-platform app that runs on Windows, MacOS, and Linux. It is fully open source and designed to be simple and straightforward to use.

The Fossity Probe captures basic information and fingerprints from your code. These fingerprints provide auditors with the information they need to perform your audit, without requiring the transfer of any sensitive information from your code or company.
<div align="center">
  <img src=".erb/img/probe_1.c65_358.png" align="center" width="70%" />
</div>

## Prerequisites

- Node.js v14+
- NPM (Node Packages Manager)

We strongly recommend handling your node versions using [nvm](https://github.com/nvm-sh/nvm)

## Install

```bash
npm install
```
---
⚠️ **Windows Users:**  

To install the dependencies, run **'npm install'** using **Command Prompt (CMD)**.


## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

For live reloading you can use `npm run start --watch` to run the app using [Electronmon](https://github.com/catdad/electronmon#readme). Warning: this tool has a high memory consumption.

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Multi-language (i18n)

Fossity Probe is multi-language enabled. To contribute a new language please see our [internationalization documentation](assets/i18n/README.md).

## Contributing

Fossity Probe is an open source project, and we love to receive contributions from our community. There are many ways to contribute. For more information see the [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).


The Fossity Probe is based on the [SCANOSS Audit Workbench](https://github.com/scanoss/audit-workbench)

