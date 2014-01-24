﻿var assert = require("assert"),
    fs = require('fs'),
    path = require("path"),
    jaydata = require("odata-server"),
    describeReporting = require("../../../test/helpers.js").describeReporting,
    describeReportingPlayground = require("../../../test/helpers.js").describeReportingPlayground;

describeReporting([], function(reporter) {
    describe('templating', function() {
        it('should callback error when missing template', function(done) {
            reporter.templates.create({}).then(function(template) {
                done();
            });
        });
        it('should callback error when missing template', function(done) {
            var request = {
                template: { _id: "AAAAAAAAAAAAAAAAAAAAAAAA" },
                options: { recipe: "html" },
            };

            var response = {};

            reporter.templates.handleBeforeRender(request, response).fail(function(err) {
                assert.notEqual(null, err);
                done();
            });
        });

        it('should create and find template', function(done) {
            var tmpl = {
                name: "test",
                html: "html",
                helpers: "helpers",
                engine: "engine"
            };

            reporter.templates.create(tmpl).then(function(template) {
                reporter.templates.entitySet.find(template._id).then(function(t) {
                    done();
                });
            });
        });

        it('handleBefore should find and use template', function(done) {
            var request = {
                template: {},
                options: { recipe: "html" },
            };

            reporter.templates.create({ html: "foo" }).then(function(t) {
                request.template._id = t._id;
                reporter.templates.handleBeforeRender(request, {}).then(function() {
                    assert.equal("foo", request.template.html);
                    assert.equal(1, request.template.generatedReportsCounter);

                    done();
                });
            });
        });

        it('should copy template to history', function(done) {
            reporter.templates.create({ name: "original" }).then(function(t) {
                reporter.context.templates.attach(t);
                t.name = "modified";
                reporter.context.templates.saveChanges().then(function() {
                    reporter.context.templatesHistory.toArray()
                        .then(function(fromDb) {
                            assert.equal("original", fromDb[0].name);
                            done();
                        });
                });
            });
        });
    });
});

describeReportingPlayground([], function(reporter) {
    describe('templating playground', function() {

        it('deleting template should be rejected', function(done) {
            reporter.templates.create({ html: "foo" })
                .then(function(t) {
                    reporter.templates.entitySet.remove(t);
                    reporter.templates.entitySet.saveChanges().then(function() {
                        reporter.templates.entitySet.find(t._id).then(function(templ) {
                            assert.equal("foo", templ.html);
                            done();
                        });
                    });
                });
        });

        it('updating template is rejected', function(done) {
            reporter.templates.create({ html: "foo" })
                .then(function(t) {
                    reporter.templates.entitySet.attach(t);
                    t.html = "modified";
                    reporter.templates.entitySet.saveChanges().then(function() {
                        reporter.templates.entitySet.find(t._id).then(function(templ) {
                            assert.equal("foo", templ.html);
                            done();
                        });
                    });
                });
        });

        it('creating template with same shortid should increase version', function(done) {
            reporter.templates.create({ html: "foo" })
                .then(function(t) {
                    return reporter.templates.create({ html: "foo", shortid: t.shortid });
                })
                .then(function(t) {
                    assert.equal(2, t.version);
                    done();
                });
        });

        it('creating template with different shortid should increase version', function(done) {
            reporter.templates.create({ html: "foo" })
                .then(function(t) {
                    return reporter.templates.create({ html: "foo", shortid: t.shortid + "DIFFERENT" });
                })
                .then(function(t) {
                    assert.equal(1, t.version);
                    done();
                });
        });
    });
});