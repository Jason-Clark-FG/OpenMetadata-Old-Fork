---
title: Build a Connector
slug: /sdk/python/build-connector
---

# Build a Connector

This design doc will walk through developing a connector for OpenMetadata

Ingestion is a simple python framework to ingest the metadata from various sources.

Please look at our framework [APIs](https://github.com/open-metadata/OpenMetadata/tree/main/ingestion/src/metadata/ingestion/api).

## Workflow

[workflow](https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/src/metadata/ingestion/api/workflow.py) is a simple orchestration job that runs the components in an Order.

A workflow consists of [Source](/sdk/python/build-connector/source) and [Sink](/sdk/python/build-connector/sink). It also provides support for [Stage](/sdk/python/build-connector/stage) and [BulkSink](/sdk/python/build-connector/bulk-sink).

Workflow execution happens in a serial fashion.

1. The **Workflow** runs the **source** component first. The **source** retrieves a record from external sources and emits the record downstream.
2. If the **processor** component is configured, the **workflow** sends the record to the **processor** next.
3. There can be multiple **processor** components attached to the **workflow**. The **workflow** passes a record to each **processor** in the order they are configured.
4. Once a **processor** is finished, it sends the modified record to the **sink**.
5. The above steps are repeated for each record emitted from the **source**.

In the cases where we need aggregation over the records, we can use the **stage** to write to a file or other store. Use the file written to in **stage** and pass it to **bulk sink** to publish to external services such as **OpenMetadata** or **Elasticsearch**.

{%inlineCalloutContainer%}

{%inlineCallout
    icon="source"
    bold="Source"
    href="/sdk/python/build-connector/source" %}
The connector to external systems which outputs a record for downstream to process.
{%/inlineCallout%}

{%inlineCallout
    icon="filter_alt"
    bold="Sink"
    href="/sdk/python/build-connector/sink" %}
It will get the event emitted by the source, one at a time.
{%/inlineCallout%}

{%inlineCallout
    icon="storage"
    bold="Stage"
    href="/sdk/python/build-connector/stage" %}
It can be used to store the records or to aggregate the work done by a processor.
{%/inlineCallout%}

{%inlineCallout
    icon="filter_list"
    bold="BulkSink"
    href="/sdk/python/build-connector/bulk-sink" %}
It can be used to bulk update the records generated in a workflow.
{%/inlineCallout%}

{%/inlineCalloutContainer%}
