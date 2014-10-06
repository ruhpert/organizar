# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Frequency'
        db.create_table(u'_billing_frequency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('frequency', self.gf('django.db.models.fields.IntegerField')(max_length=1, null=True, blank=True)),
        ))
        db.send_create_signal(u'_billing', ['Frequency'])

        # Adding model 'Duration'
        db.create_table(u'_billing_duration', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('duration', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=5, decimal_places=2, blank=True)),
        ))
        db.send_create_signal(u'_billing', ['Duration'])

        # Adding model 'Charge'
        db.create_table(u'_billing_charge', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('charge', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=5, decimal_places=2, blank=True)),
        ))
        db.send_create_signal(u'_billing', ['Charge'])

        # Adding model 'Contract_Type'
        db.create_table(u'_billing_contract_type', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'_billing', ['Contract_Type'])

        # Adding model 'Discount'
        db.create_table(u'_billing_discount', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('discount', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'_billing', ['Discount'])

        # Adding model 'Contract'
        db.create_table(u'_billing_contract', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('number', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['_billing.Contract_Type'])),
            ('start_date', self.gf('django.db.models.fields.DateField')(default=datetime.date.today)),
            ('end_date', self.gf('django.db.models.fields.DateField')(default=datetime.date.today)),
            ('charge', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['_billing.Charge'])),
            ('contact', self.gf('django.db.models.fields.related.ForeignKey')(related_name='contract_contact', to=orm['auth.User'])),
            ('billing_contact', self.gf('django.db.models.fields.related.ForeignKey')(related_name='contract_billing_contact', to=orm['auth.User'])),
            ('duration', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['_billing.Duration'])),
            ('frequency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['_billing.Frequency'])),
        ))
        db.send_create_signal(u'_billing', ['Contract'])

        # Adding M2M table for field discount on 'Contract'
        m2m_table_name = db.shorten_name(u'_billing_contract_discount')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('contract', models.ForeignKey(orm[u'_billing.contract'], null=False)),
            ('discount', models.ForeignKey(orm[u'_billing.discount'], null=False))
        ))
        db.create_unique(m2m_table_name, ['contract_id', 'discount_id'])


    def backwards(self, orm):
        # Deleting model 'Frequency'
        db.delete_table(u'_billing_frequency')

        # Deleting model 'Duration'
        db.delete_table(u'_billing_duration')

        # Deleting model 'Charge'
        db.delete_table(u'_billing_charge')

        # Deleting model 'Contract_Type'
        db.delete_table(u'_billing_contract_type')

        # Deleting model 'Discount'
        db.delete_table(u'_billing_discount')

        # Deleting model 'Contract'
        db.delete_table(u'_billing_contract')

        # Removing M2M table for field discount on 'Contract'
        db.delete_table(db.shorten_name(u'_billing_contract_discount'))


    models = {
        u'_billing.charge': {
            'Meta': {'object_name': 'Charge'},
            'charge': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'_billing.contract': {
            'Meta': {'object_name': 'Contract'},
            'billing_contact': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'contract_billing_contact'", 'to': u"orm['auth.User']"}),
            'charge': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['_billing.Charge']"}),
            'contact': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'contract_contact'", 'to': u"orm['auth.User']"}),
            'discount': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'contract_discounts'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['_billing.Discount']"}),
            'duration': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['_billing.Duration']"}),
            'end_date': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'frequency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['_billing.Frequency']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'start_date': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['_billing.Contract_Type']"})
        },
        u'_billing.contract_type': {
            'Meta': {'object_name': 'Contract_Type'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'_billing.discount': {
            'Meta': {'object_name': 'Discount'},
            'discount': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'_billing.duration': {
            'Meta': {'object_name': 'Duration'},
            'duration': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'_billing.frequency': {
            'Meta': {'object_name': 'Frequency'},
            'frequency': ('django.db.models.fields.IntegerField', [], {'max_length': '1', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['_billing']